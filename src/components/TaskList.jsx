import React, {useState} from "react";
import Task from "./Task";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

export default function TaskList(props) {
    const [stateCheck, setStateCheck] = useState(false);

    function cbCallback(event, id) {

    }

    return (
        <List sx={{ width: 1, 
                    overflow: 'auto', 
                    width: "100%",
                    minWidth: 400, 
                    maxWidth: 600, 
                    minHeight: 400, 
                    maxHeight: 400, 
                    bgcolor: 'background.paper',
                    fontSize: "14px",
                    fontWeight: 500,
                    boxShadow: 2,
                    textAlign: "left",
                    borderRadius: "10px"
                    }}>
            <div className="TaskList-header">{props.tasks.length} Tasks Found</div>
            {props.tasks.map(function(task, idx) {
                return (
                    <div key={idx}>
                        {idx === 0 && <Divider />}
                        <Task
                            key={idx}
                            id={task._id}
                            item={task.item}
                            due={props.showDates ? task.due : ""}
                            checked={task.checked}
                            onChecked={props.onChecked}
                            onEdit={props.onEdit}
                        />
                        <Divider />
                    </div>);
            }
            )}
        </List>
    );
}
