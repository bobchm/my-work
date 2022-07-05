import React from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function ToDoItem(props) {

    return (
        <FormControlLabel
            control={
                <Checkbox
                    onChange={event => props.onChecked(event, props.id)}
                />}
            label={props.item} />
    );
}

export default ToDoItem;