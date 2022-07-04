import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function WorkingInput(props) {
    return (<form onSubmit={props.addItem}>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
            <TextField variant="outlined" onChange={props.handleChange} value={props.inputText} />
            <Button onClick={props.addItem} variant="contained" startIcon={<AddCircleOutlineIcon />}>
                Add
            </Button>
        </Stack>
    </form>);
}

export default WorkingInput;
