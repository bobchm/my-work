import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Check from '@mui/icons-material/Check';

export default function ButtonAppBar(props) {
  const [anchor, setAnchor] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [due, setDue] = useState("All");

  const dueOptions = ["All", "Today", "Tomorrow"];

  function buildOptions() {
    return {
      completed: completed,
      due: due
    }
  }

  const openMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  function closeMenu(settingsCallback) {
    setAnchor(null);
    if (settingsCallback) {
      settingsCallback(buildOptions());
    }
  };

  const onCompletedClick = (event) => {
    setCompleted(!completed);
  };

  const onDueClick = (event, idx) => {
    setDue(dueOptions[idx]);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" alignItems="flex-start">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={openMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={() => closeMenu(props.settingsCallback)}
            keepMounted
            // TransitionComponent={Slide}
            PaperProps={{
              style: {
                maxHeight: 40 * 5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              key={0}
              onClick={(event) => onCompletedClick(event)}
            >
              {completed
                ? <><ListItemIcon><Check /></ListItemIcon>Completed</>
                : <ListItemText inset>Completed</ListItemText>}
            </MenuItem>
            <Divider />
            {dueOptions.map(function(opt, idx) {
              return (<MenuItem
                key={idx}
                onClick={(event) => onDueClick(event, idx)}
              >
                {due === dueOptions[idx] 
                  ? <><ListItemIcon><Check /></ListItemIcon>{opt}</>
                  : <ListItemText inset>{opt}</ListItemText>}
              </MenuItem>);
            }
            )}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Work
          </Typography>
          <IconButton color="inherit" edge="end"><SettingsIcon /></IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}