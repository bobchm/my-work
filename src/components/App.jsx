import React, { useState, useEffect } from "react";
import WorkAppBar from "./WorkAppBar";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import TaskList from "./TaskList";
import Stack from '@mui/material/Stack';
import { getInputAdornmentUtilityClass, getTableBodyUtilityClass } from "@mui/material";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [inputText, setInputText] = useState("");
    const [anySelected, setAnySelected] = useState(false);
    const [completed, setCompleted] = useState(false);
    
    // This fetches the tasks from the database.
    useEffect(() => {

        function getParams() {
            return "?" + new URLSearchParams({
                completed: completed
            });
        }

        async function getTasks() {
            const response = await fetch('http://localhost:5000/task/' + getParams());

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const tasks = await response.json();
            console.log(tasks);
            setTasks(tasks);
        }

        getTasks();

        return;
    }, [tasks.length, completed]);

    // handler for typing into the task text box
    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }

    function getToday() {
        var dt = new Date();
        return (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getFullYear();
    }

    // add a new task
    async function addTask(event) {
        var text = inputText.trim();
        if (text.length > 0) {
            var jtask = {
                item: text,
                due: getToday(),
                note: "",
                tag: "",
                completed: false
            }

            await fetch("http://localhost:5000/task/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(jtask),
              })
              .catch(error => {
                window.alert(error);
                return;
              });
          

            setInputText("");

            // force useEffects
            setTasks(tasks => [...tasks, jtask]);
        }
        //event.preventDefault();
    }

    function addTaskSubmit(event) {
        setTimeout(function() {
            addTask(event);
        }, 100);
        event.preventDefault();
    }

    // they toggled one of the task checkboxes - enable/disable relevant buttons
    function doCheckboxToggle(event, id) {
        console.log(id);
        var any = event.target.checked;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]._id === id) {
                tasks[i].checked = event.target.checked;
            } else if (tasks[i].checked) {
                any = true;
            }
        }
        setAnySelected(any);
    }

    async function deleteTask(id) {
        await fetch(`http://localhost:5000/${id}`, {
            method: "DELETE"
        });        
    }

    // handler for the delete button
    function handleDelete() {
        const newItems = tasks.filter((item) => {
            if (item.checked) {
                deleteTask(item._id);
            }
            return (!item.checked);
        });

        setTasks(newItems);
    }

    // handler for the task completion button
    async function completeTask(id) {

        // get the task from the database
        const id_s = id.toString();
        const response = await fetch(`http://localhost:5000/task/${id_s}`);
  
        if (!response.ok) {
          const message = `An error has occured: ${response.statusText}`;
          window.alert(message);
          return;
        }
  
        const task = await response.json();
        if (!task) {
          window.alert(`Task with id ${id_s} not found`);
          return;
        }

        console.log(task);
  
        // mark as complete
        task.completed = true;

        // save back to database
        await fetch(`http://localhost:5000/update/${id_s}`, {
            method: "POST",
            body: JSON.stringify(task),
            headers: {
              'Content-Type': 'application/json'
            },
          });
    }

    function handleComplete() {
        const newItems = tasks.filter((item) => {
            if (item.checked) {
                completeTask(item._id);
            }
            return (!item.checked);
        });

        setTasks(newItems);
    }

    function menuSettingsCallback(settings) {
        if (settings) {
            setCompleted(settings.completed);
        }
    }

    // render
    return (
        <div>
            <WorkAppBar settingsCallback={menuSettingsCallback} />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <ActionRow onDelete={handleDelete} onComplete={handleComplete} anySelected={anySelected}/>
                <WorkInput addItem={addTaskSubmit} handleChange={handleChange} inputText={inputText} />
                <TaskList tasks={tasks} onChecked={doCheckboxToggle} />
            </Stack>
        </div>
    );
}

