import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

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
            navigate("/");
            return;
          }
    
          setForm(task);
        }
    
        fetchData();
    
        return;
      }, [params.id, navigate]);
    
      // These methods will update the state properties.
      function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
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
    
        navigate("/");
      }
    
      // This following section will display the form that takes input from the user to update the data.
      return (
        <div>
          <h3>Update Task</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="item">Item: </label>
              <input
                type="text"
                className="form-control"
                id="item"
                value={form.item}
                onChange={(e) => updateForm({ item: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="due">Due: </label>
              <input
                type="text"
                className="form-control"
                id="due"
                value={form.due}
                onChange={(e) => updateForm({ due: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="note">Note: </label>
              <input
                type="text"
                className="form-control"
                id="note"
                value={form.note}
                onChange={(e) => updateForm({ note: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tag">Tag: </label>
              <input
                type="text"
                className="form-control"
                id="tag"
                value={form.tag}
                onChange={(e) => updateForm({ tag: e.target.value })}
              />
            </div>
            <br />
    
            <div className="form-group">
              <input
                type="submit"
                value="Update Task"
                className="btn btn-primary"
              />
              <input
                type="button"
                value="Cancel"
                className="btn btn-primary"
                onClick={() => navigate("/")}
              />
            </div>
          </form>
        </div>
      );
    }