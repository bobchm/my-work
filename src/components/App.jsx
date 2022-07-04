import React, { useState } from "react";
import WorkAppBar from "./WorkAppBar";
import ActionRow from "./ActionRow";
import WorkInput from "./WorkInput";
import ToDoList from "./ToDoList";
import Stack from '@mui/material/Stack';

function App() {
    const [inputText, setInputText] = useState("");
    const [items, setItems] = useState([]);

    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }

    function addItem(event) {
        var text = inputText.trim();
        if (text.length > 0) {
            setItems((prevItems) => {
                return [...prevItems, inputText];
            });
            setInputText("");
        }
        event.preventDefault();
    }

    function doCheckboxToggle(id) {

    }

    function deleteItem(id) {
        setItems((prevItems) => {
            return prevItems.filter((item, idx) => {
                return idx !== id;
            });
        });
    }

    return (
        <div>
            <WorkAppBar />
            <Stack className="container" direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                <ActionRow addItem={addItem} handleChange={handleChange} inputText={inputText} />
                <WorkInput addItem={addItem} handleChange={handleChange} inputText={inputText} />
                <ToDoList items={items} onChecked={doCheckboxToggle} />
            </Stack>
        </div>
    );
}

export default App;