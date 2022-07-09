import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SettingsDisplay(props) {

    var text = "";
    if (props.hasOwnProperty('due')) {
        text += props.due;
    }
    if (props.hasOwnProperty('completed')) {
        if (text.length > 0) {
            text += " ";
        }
        if (props.completed) {
            text += "Completed";
        } else {
            text += "Incomplete"
        }
    }
    if (props.hasOwnProperty('tag')) {
        if (text.length > 0) {
            text += " | ";
        }
        text += props.tag;
    }

    return (
        <Box sx={{margin: "0px", width: '100%', boxShadow: 2, borderRadius: "10px", backgroundColor: 'azure'}}>
        <Typography variant="body" component="div" align='center' sx={{ fontSize: 14, height: 1, color: 'black' }}>
        {text}
      </Typography>
      </Box>
    );
}
