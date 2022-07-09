import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Check from '@mui/icons-material/Check';

export default function ButtonAppBar(props) {
  const [anchor, setAnchor] = useState(null);
  const [selected, setSelected] = useState(-1);

  const options = ["Completed"];

  function isCompletedIndex(idx) {
    return (idx >= 0 && idx < options.length && options[idx] === "Completed")
  }

  function buildOptions() {
    return {
      completed: isCompletedIndex(selected)
    }
  }

  const openMenu = (event) => {
    console.log(event.currentTarget);
    setAnchor(event.currentTarget);
  };

  function closeMenu(settingsCallback) {
    setAnchor(null);
    if (settingsCallback) {
      settingsCallback(buildOptions());
    }
  };

  const onMenuItemClick = (event, index) => {
    if (isCompletedIndex(index)) {
      if (index === selected) {
        setSelected(-1);
      } else {
        setSelected(index);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
                maxHeight: 40 * 4,
                width: "20ch",
              },
            }}
          >
            {options.map((option, index) => (
              <MenuItem
                key={index}
                onClick={(event) => onMenuItemClick(event, index)}
              >
                {index === selected && <ListItemIcon><Check /></ListItemIcon>}
                {option}
              </MenuItem>
            ))}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Work
          </Typography>
          <IconButton color="inherit"><SettingsIcon /></IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}