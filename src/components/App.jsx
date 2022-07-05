import React, { useState } from "react";
import WorkAppBar from "./WorkAppBar";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import ToDoList from "./ToDoList";
import Stack from '@mui/material/Stack';

var todoIds = 0;

function App() {
    const [inputText, setInputText] = useState("");
    const [items, setItems] = useState([]);
    const [anySelected, setAnySelected] = useState(false);

    function generateToDoId() {
        var newTodoID = todoIds++;
        console.log("TODOID: " + newTodoID);
        return newTodoID;
    }

    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }

    function addItem(event) {
        var text = inputText.trim();
        if (text.length > 0) {
            setItems((prevItems) => {
                return [...prevItems, {
                    text: inputText,
                    checked: false,
                    toDoId: generateToDoId()
            }];
            });
            setInputText("");
        }
        event.preventDefault();
    }

    function doCheckboxToggle(event, id) {
        console.log(event.target.checked);
        console.log(id);
        var any = event.target.checked;
        for (let i = 0; i < items.length; i++) {
            if (items[i].toDoId === id) {
                items[i].checked = event.target.checked;
            } else if (items[i].checked) {
                any = true;
            }
        }
        setAnySelected(any);
    }

    function handleDelete() {
        console.log("Delete");

        var newItems = items.filter((item) => {
            return (!item.checked);
        });

        // This is ridiculous but there doesn't seem to be
        // a good way to force React to reset its checkbox
        // list. If you don't do this, the checked state is
        // retained after the delete.
        setItems([]);
        setTimeout(function() {
            setItems(newItems);
        }, 10);
    }

    function handleComplete() {
        console.log("Complete")

        // same as Delete for now
        handleDelete();
    }

    return (
        <div>
            <WorkAppBar />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <ActionRow onDelete={handleDelete} onComplete={handleComplete} anySelected={anySelected}/>
                <WorkInput addItem={addItem} handleChange={handleChange} inputText={inputText} />
                <ToDoList items={items} onChecked={doCheckboxToggle} />
            </Stack>
        </div>
    );
}

export default App;