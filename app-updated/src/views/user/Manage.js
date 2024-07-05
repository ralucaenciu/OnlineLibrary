import React, { useState } from "react";
import { Grid, Typography, Tabs, Tab, Box } from "@mui/material";
import ChangePassword from "./ChangePassword";
import UpdateProfile from "./UpdateProfile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function Manage() {
  const [value, setValue] = useState(0);
  const handleChange = (e, ne) => setValue(ne);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h4">
          Setari
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: "auto",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              width: "270px",
            }}
          >
            <Tab label="Modifica profil" {...a11yProps(0)} />
            <Tab label="Schimba parola" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <UpdateProfile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Manage;
