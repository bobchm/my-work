import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function WorkingInput(props) {
    return (<form onSubmit={props.addItem}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
                <TextField fullWidth variant="outlined" onChange={props.handleChange} value={props.inputText} />
            </Grid>
            <Grid item xs={2}>
                <Button onClick={props.addItem} variant="contained" startIcon={<AddCircleOutlineIcon />}>
                    Add
                </Button>
            </Grid>
        </Grid>
    </form>);
    }

