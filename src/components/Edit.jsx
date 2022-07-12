import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MyDatePicker from "./MyDatePicker";
import { encodeDate } from "./Dates";

export default function Edit() {
    const [form, setForm] = useState({
        item: "",
        due: "",
        note: "",
        tag: "",
        completed: false
      });
      const params = useParams();
      const navigate = useNavigate();

          // we can pass in state for due and completed (and later tag)
      var initDue = "All";
      var initCompleted = false;
      const [searchParams] = useSearchParams();
      if (searchParams.get("due")) {
          initDue = searchParams.get("due");
      }
      if (searchParams.get("completed")) {
          initCompleted = searchParams.get("completed");
      }
      const [due] = useState(initDue);
      const [completed] = useState(initCompleted);
    
      useEffect(() => {
        async function fetchData() {
          const id = params.id.toString();
          const response = await fetch(`http://localhost:5000/task/${params.id.toString()}`);
    
          if (!response.ok) {
            const message = `An error has occured: ${response.statusText}`;
            window.alert(message);
            return;
          }
    
          const task = await response.json();
          if (!task) {
            window.alert(`Task with id ${id} not found`);
            goHome();
            return;
          }
    
          setForm(task);
        }
    
        fetchData();
    
        return;
      }, [params.id]);
    
      // These methods will update the state properties.
      function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }

      // navigate back to the main page, preserving state
      function goHome() {
        navigate(`/?completed=${completed}&due=${due}`);
      }
    
      async function onSubmit(e) {
        e.preventDefault();
        const editedTask = {
          item: form.item,
          due: form.due,
          note: form.note,
          tag: form.tag,
          completed: form.completed
        };
    
        // This will send a post request to update the data in the database.
        await fetch(`http://localhost:5000/update/${params.id}`, {
          method: "POST",
          body: JSON.stringify(editedTask),
          headers: {
            'Content-Type': 'application/json'
          },
        });
    
        goHome();
      }

      // callback for the date picker
      function handleDateChange(newValue) {
        updateForm({ due: encodeDate(newValue) });
      }
    
      // This following section will display the form that takes input from the user to update the data.
      return (
          <div>
              <Box sx={{ flexGrow: 1, borderRadius: "10px" }}>
                  <AppBar
                        position="static"
                        sx={{ borderRadius: "10px 10px 0px 0px" }}>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Update Task
                            </Typography>
                        </Toolbar>
                  </AppBar>
              </Box>
              <Paper
                  sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      borderRadius: "10px",
                  }}
              >
                  <Stack 
                    className="container" 
                    direction="column" 
                    alignItems="flex-start" 
                    justifyContent="flex-start" 
                    sx={{maxHeight: 200}}
                    spacing={2}>
                      <TextField
                          value={form.item}
                          onChange={(e) => updateForm({ item: e.target.value })}
                          label={"Task"}
                      />
                      <MyDatePicker
                        date={new Date(form.due)}
                        label={"Due Date"}
                        callback={handleDateChange}
                      />
                      <TextField
                          value={form.note}
                          onChange={(e) => updateForm({ note: e.target.value })}
                          label={"Note"}
                      />
                      <TextField
                          value={form.tag}
                          onChange={(e) => updateForm({ tag: e.target.value })}
                          label={"Tag"}
                      />
                      <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
                          <Button
                              onClick={event => onSubmit(event)}
                              variant="contained"
                              startIcon={<SaveIcon />}>
                              Save
                          </Button>
                          <Button
                              onClick={() => goHome()}
                              variant="contained"
                              startIcon={<CancelIcon />}>
                              Cancel
                          </Button>
                      </Stack>
                  </Stack>
              </Paper>
          </div>
      );
    }