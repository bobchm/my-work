import React, { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';

function ActionRow(props) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <IconButton 
                aria-label="complete" 
                disabled 
                color="primary"
                onClick={props.onComplete}>
                <DoneIcon />
            </IconButton>
            <IconButton 
                aria-label="delete" 
                disabled 
                color="primary"
                onClick={props.onDelete}>
                <DeleteIcon />
            </IconButton>
        </Stack>
    )
}

export default ActionRow;