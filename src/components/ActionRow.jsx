import React, { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import PostAddIcon from '@mui/icons-material/PostAdd';

export default function ActionRow(props) {
    return (
        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <IconButton 
                aria-label="complete" 
                disabled={!props.anySelected}
                color="primary"
                onClick={props.onComplete}>
                <DoneIcon />
            </IconButton>
            <IconButton 
                aria-label="delete" 
                disabled={!props.anySelected} 
                color="primary"
                onClick={props.onDelete}>
                <DeleteIcon />
            </IconButton>
            <IconButton 
                aria-label="postpone" 
                disabled={!props.anySelected} 
                color="primary"
                onClick={props.onPostpone}>
                <PostAddIcon />
            </IconButton>        </Stack>
    )
}
