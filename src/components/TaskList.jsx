import React, { useState } from "react";
import Task from "./Task";
import List from '@mui/material/List';

export default function TaskList(props) {
    return (
        <List sx={{ width: 1, overflow: 'auto', maxWidth: 360, minWidth: 360, maxHeight: 400, bgcolor: 'background.paper'}}>
            {props.tasks.map((task, idx) => (
                <Task
                    key={idx}
                    id={task._id}
                    item={task.item}
                    onChecked={props.onChecked}
                    onEdit={props.onEdit}
                />
            ))}
        </List>
    );
}
