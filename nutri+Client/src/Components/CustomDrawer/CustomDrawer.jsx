import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Button, IconButton, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkModeState } from "../../Pages/store/slices/darkMode";

const CustomDrawer = ({ list, links }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.darkMode); 

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleDarkMode = () => {
    dispatch(toggleDarkModeState()); // Dispatch the action to toggle dark mode
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Button onClick={toggleDarkMode} sx={{ marginTop: "10px", color: "black" }}>
        {darkMode ? "Light Mode" : "Dark Mode"} {/* Button text dynamically changes based on `darkMode` */}
      </Button>
      <MuiLink component={RouterLink} to="/home" underline="none" sx={{ color: darkMode ? "black" : "white" }}>
        <Avatar sx={{ marginTop: "10px", width: "100%", height: "50%" }} src="logo2.png" />
      </MuiLink>
      <List>
        {list.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={RouterLink} to={links[index]} underline="none">
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {!darkMode && (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon sx={{color:"black"}} />
        </IconButton>
      )}
      {darkMode && (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
      )}

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CustomDrawer;