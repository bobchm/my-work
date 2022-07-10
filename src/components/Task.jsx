import React from "react";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function Task(props) {

    return (
        <ListItem
        key={props.id}
        secondaryAction={
          <IconButton 
            edge="end" 
            aria-label="comments" 
            onClick={event => props.onEdit(event, props.id)}
            >
            <EditIcon />
          </IconButton>
        }
        disablePadding
      >
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': props.id }}
              onChange={event => props.onChecked(event, props.id)}
            />
          </ListItemIcon>
          <ListItemText 
            id={props.id} 
            primary={props.item}
            primaryTypographyProps={{ 
                variant: 'subtitle2', 
                style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
            }}} />
        </ListItemButton>
      </ListItem>       
    );
}

