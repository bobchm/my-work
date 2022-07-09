import React, { useState } from "react";
import Task from "./Task";
import FormGroup from '@mui/material/FormGroup';

export default function TaskList(props) {
    return (
        <div>
        <FormGroup>
            {props.tasks.map((task, idx) => (
                <Task
                    key={idx}
                    id={task._id}
                    item={task.item}
                    onChecked={props.onChecked}
                />
            ))}
        </FormGroup>
        </div>
    );
}
