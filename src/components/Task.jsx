import React, {useState, useEffect} from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function Task(props) {

    return (
        <FormControlLabel
            control={
                <Checkbox
                    onChange={event => props.onChecked(event, props.id)}
                />}
            label={props.item} />
    );
}
