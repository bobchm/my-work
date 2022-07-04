import React, { useState } from "react";
import ToDoItem from "./ToDoItem";
import FormGroup from '@mui/material/FormGroup';

function ToDoList(props) {
    return (
        <div>
        <FormGroup>
            {props.items.map((todoItem, idx) => (
                <ToDoItem
                    key={idx}
                    id={idx}
                    item={todoItem}
                    onChecked={props.onChecked}
                />
            ))}
        </FormGroup>
        </div>
    );
}

export default ToDoList;