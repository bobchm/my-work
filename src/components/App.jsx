import React, { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import WorkAppBar from "./WorkAppBar";
import SettingsDisplay from "./SettingsDisplay";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import TaskList from "./TaskList";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [inputText, setInputText] = useState("");
    const [anySelected, setAnySelected] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [due, setDue] = useState("All");
    
    // This fetches the tasks from the database.
    useEffect(() => {

        function getParams() {
            var params = {completed: completed};
            var sDate;

            switch (due) {
                case "Today":
                    sDate = getToday();
                    break;
                case "Tomorrow":
                    sDate = addDays(getToday(), 1);
                    break;
                default:
                    sDate = "";
            }
            if (sDate.length > 0) {
                params = {...params, due: sDate};
            }

            // do tags later
            return "?" + new URLSearchParams(params);
        }

        async function getTasks() {
            const response = await fetch('http://localhost:5000/task/' + getParams());

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const tasks = await response.json();
            setTasks(tasks);
        }

        getTasks();

        return;
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks.length, completed, due]);

    // handler for typing into the task text box
    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }

    function encodeDate(dt) {
        return (dt.getMonth() + 1) + "-" + dt.getDate() + "-" + dt.getFullYear();
    }

    function addDays(dateS, nDays) {
        var startDate = new Date(dateS);
        var newDate = new Date();
        newDate.setDate(startDate.getDate() + nDays);
        return encodeDate(newDate);
    }

    function getToday() {
        return encodeDate(new Date());
    }

    // add a new task
    async function addTask(event) {
        var text = inputText.trim();
        if (text.length > 0) {
            var dueDate = getToday();
            if (due === "Tomorrow") {
                dueDate = addDays(dueDate, 1);
            }
            var jtask = {
                item: text,
                due: dueDate,
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

    function handleEdit(event, id) {
        window.alert(`Editing ${id}`)
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
    async function changeTask(id, key, value) {

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

        // mark as complete
        var newTask = {...task, [key]: value};

        // save back to database
        await fetch(`http://localhost:5000/update/${id_s}`, {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
              'Content-Type': 'application/json'
            },
          });
    }

    function handleComplete() {
        const newItems = tasks.filter((item) => {
            if (item.checked) {
                changeTask(item._id, "completed", true);
            }
            return (!item.checked);
        });

        setTasks(newItems);
    }

    function handlePostpone() {
        const newItems = tasks.filter((item) => {
            if (item.checked) {
                changeTask(item._id, "due", addDays(item.due, 1));
            }
            return (!item.checked);
        });

        setTasks(newItems);
    }

    function menuSettingsCallback(settings) {
        if (settings) {
            setCompleted(settings.completed);
            setDue(settings.due);
        }
    }

    // render
    return (
        <div>
            <WorkAppBar settingsCallback={menuSettingsCallback} />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <SettingsDisplay completed={completed} due={due} />
                <WorkInput addItem={addTaskSubmit} handleChange={handleChange} inputText={inputText} />
                <TaskList 
                    tasks={tasks} 
                    onChecked={doCheckboxToggle}
                    onEdit={handleEdit}
                />
                <ActionRow onDelete={handleDelete} onComplete={handleComplete} onPostpone={handlePostpone} anySelected={anySelected}/>
            </Stack>
        </div>
    );
}

