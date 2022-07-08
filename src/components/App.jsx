import React, { useState, useEffect } from "react";
import WorkAppBar from "./WorkAppBar";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import TaskList from "./TaskList";
import Stack from '@mui/material/Stack';
import { getInputAdornmentUtilityClass, getTableBodyUtilityClass } from "@mui/material";

var todoIds = 0;

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [inputText, setInputText] = useState("");
    const [anySelected, setAnySelected] = useState(false);

    
    // This fetches the tasks from the database.
    useEffect(() => {

        function getParams() {
            return "";
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
    }, [tasks.length]);

    // handler for typing into the task text box
    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }

    function getToday() {
        return "07-08-2022";
    }

    // add a new task
    async function addTask(event) {
        var text = inputText.trim();
        if (text.length > 0) {
            var jtask = {
                item: text,
                due: getToday(),
                note: "",
                tags: [],
                completed: false
            }
            console.log(jtask);

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
            setTasks([]);
        }
        event.preventDefault();
    }

    // they toggled one of the task checkboxes - enable/disable relevant buttons
    function doCheckboxToggle(event, id) {
        console.log(id);
        var any = event.target.checked;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === id) {
                tasks[i].checked = event.target.checked;
            } else if (tasks[i].checked) {
                any = true;
            }
        }
        setAnySelected(any);
    }

    // handler for the delete button
    function handleDelete() {
        console.log("Delete");

        var newItems = tasks.filter((item) => {
            return (!item.checked);
        });

        // This is ridiculous but there doesn't seem to be
        // a good way to force React to reset its checkbox
        // list. If you don't do this, the checked state is
        // retained after the delete.
        setTasks([]);
        setTimeout(function() {
            setTasks(newItems);
        }, 10);
    }

    // handler for the task completion button
    function handleComplete() {
        console.log("Complete")

        // same as Delete for now
        handleDelete();
    }

    // render
    return (
        <div>
            <WorkAppBar />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <ActionRow onDelete={handleDelete} onComplete={handleComplete} anySelected={anySelected}/>
                <WorkInput addItem={addTask} handleChange={handleChange} inputText={inputText} />
                <TaskList tasks={tasks} onChecked={doCheckboxToggle} />
            </Stack>
        </div>
    );
}

