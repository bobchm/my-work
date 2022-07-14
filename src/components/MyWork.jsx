import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import WorkAppBar from "./WorkAppBar";
import SettingsDisplay from "./SettingsDisplay";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import TaskList from "./TaskList";
import {addDays, getToday} from "../dates";
import { getCookie, setCookie } from "../cookies";
import taskURL from "../taskURL";

export default function MyWork() {
    const [tasks, setTasks] = useState([]);
    const [inputText, setInputText] = useState("");
    const [anySelected, setAnySelected] = useState(false);
    
    // we can pass in state for due date, completed, and list
    const [initDue, initCompleted, initTaskList] = restoreDisplayContext("All", false, "");
    const [due, setDue] = useState(initDue);
    const [completed, setCompleted] = useState(initCompleted);
    const [taskList, setTaskList] = useState(initTaskList);
    const [taskLists, setTaskLists] = useState([]);
 
    const navigate = useNavigate();
    
    // This fetches the tasks from the database.
    useEffect(() => {

        function getParams() {
            var params = {completed: completed};
            var sDate;

            if (taskList && taskList.length > 0) {
                params = {...params, taskList: taskList};
            }

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

            return "?" + new URLSearchParams(params);
        }

        // get all or filtered tasks from MongoDB
        async function getTasks() {
            const response = await fetch(taskURL('task/' + getParams()));

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const tasks = await response.json();
            tasks.map((task) => task.checked = false);
            sortAndSetTasks(tasks);
        }

        // get the task lists used by the system
        async function getTaskLists() {
            const response = await fetch(taskURL('taskLists/'));

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const lists = await response.json();
            setTaskLists(lists);
        }

        saveDisplayContext();
        getTaskLists();
        getTasks();

        return;
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks.length, completed, due, taskList]);

    // sort tasks based on the current filter criteria and set
    async function sortAndSetTasks(tasks) {
        await tasks.sort(function(a, b) {
            if (a.item < b.item) {
                return -1;
            } else if (a.item > b.item) {
                return 1;
            } else {
                return 0;
            }
        });

        console.log(`tasks: ${tasks}`);
        setTasks(tasks);
    }

    // set or get the diplay context across sessions
    function restoreDisplayContext(defaultDue, defaultCompleted, defaultList) {
        var cDueDate;
        var cCompleted;
        var cList;
        if ((cDueDate = getCookie("dueDate")) === undefined) {
            cDueDate = defaultDue;
        }
        if ((cCompleted = getCookie("completed")) === undefined) {
            cCompleted = defaultCompleted;
        } else if (cCompleted === "true") {
            cCompleted = true;
        } else {
            cCompleted = false;
        }
        if ((cList = getCookie("taskList")) === "undefined") {
            cList = defaultList;
        }
        return [cDueDate, cCompleted, cList];
    }

    function saveDisplayContext() {
        setCookie("dueDate", due, {'max-age': 60*60*24});
        setCookie("completed", completed, {'max-age': 60*60*24});
        setCookie("taskList", taskList, {'max-age': 60*60*24});
    }

    // handler for typing into the task text box
    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
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
                taskList: "",
                completed: false
            }

            await fetch(taskURL("task/add"), {
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
            jtask.checked = false;
            tasks.push(jtask);
            sortAndSetTasks(tasks);
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
        console.log(`doCheckboxToggle: ${id}`);
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

    // jump to the edit dialog page to edit a task
    function handleEdit(event, id) {
        // we're leaving this page, save the due date and completed incomplete context
        navigate(`/edit/${id}?due=${due}&completed=${completed}`);
    }

    // delete a task from MongoDB
    async function deleteTask(id) {
        await fetch(taskURL(`${id}`), {
            method: "DELETE"
        });        
    }

    // handler for the task completion button
    async function changeTask(id, key, value) {

        // get the task from the database
        const id_s = id.toString();
        const response = await fetch(taskURL(`task/${id_s}`));
  
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
        await fetch(taskURL(`update/${id_s}`), {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
              'Content-Type': 'application/json'
            },
          });
    }

    // handler for the delete button
    function handleDelete() {
        const newItems = tasks.filter((item) => {
            var thisone = item.checked;
            if (thisone) {
                deleteTask(item._id);
            }
            return (!thisone);
        });

        sortAndSetTasks(newItems);
        setAnySelected(false);
    }

    function handleComplete() {
        const newItems = tasks.filter((item) => {
            var thisone = item.checked
            if (thisone) {
                changeTask(item._id, "completed", true);
            }
            return (!thisone);
        });

        sortAndSetTasks(newItems);
        setAnySelected(false);
    }

    function handlePostpone() {
        const newItems = tasks.filter((item) => {
            var thisone = item.checked;
            if (thisone) {
                changeTask(item._id, "due", addDays(item.due, 1));
            }
            return (!thisone);
        });

        sortAndSetTasks(newItems);
        setAnySelected(false);
    }

    function menuSettingsCallback(settings) {
        if (settings) {
            setCompleted(settings.completed);
            setDue(settings.due);
            setTaskList(settings.taskList);
        }
    }

    // render
    return (
        <div>
            <WorkAppBar 
                settingsCallback={menuSettingsCallback} 
                completed={completed} due={due} 
                taskList={taskList}
                taskLists={taskLists}
                />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <SettingsDisplay completed={completed} due={due} taskList={taskList} />
                <WorkInput addItem={addTaskSubmit} handleChange={handleChange} inputText={inputText} sx={{width: "100%"}}/>
                <TaskList 
                    tasks={tasks} 
                    onChecked={doCheckboxToggle}
                    onEdit={handleEdit}
                    showDates={due === "All"}
                />
                <ActionRow onDelete={handleDelete} onComplete={handleComplete} onPostpone={handlePostpone} anySelected={anySelected}/>
            </Stack>
        </div>
    );
}

