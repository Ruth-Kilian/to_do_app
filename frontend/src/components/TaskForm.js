/* Child componenet that renders a from for adding or editing a tasks*/

import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const TaskForm = ({ addTask, initialTitle = "", onCancel }) => {
  // for editing a task the state is set the initialTitle prop
  const [title, setTitle] = useState(initialTitle);
  // this state is based on wheter the initialTitle prop is provided or not
  const [isEditMode, setIsEditMode] = useState(initialTitle !== "");

  // updates the title and isEditMode accordingly
  useEffect(() => {
    setTitle(initialTitle);
    setIsEditMode(initialTitle !== "");
  }, [initialTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // checks if the title is not empty after trimming any whitespace and calls the addTask function
    if (title.trim() !== "") {
      addTask(title);
      setTitle("");
      setIsEditMode(false);
    }
  };

  // if the task is being edited -> set to true - the Edit Task form is renderd with two buttons edit and cancel
  if (isEditMode) {
    return (
      <div className="container1">
        <div>
          <h2>Edit Task</h2>
          <Form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button type="submit" className="btn btn-primary">
              Update Task
            </Button>
            <Button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  // if a task is not being edited then the default state is the Add Task form
  return (
    <div>
      <h2>Add Task</h2>
      <Form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" className="btn btn-primary">
          Add Task
        </Button>
      </Form>
    </div>
  );
};

export default TaskForm;
