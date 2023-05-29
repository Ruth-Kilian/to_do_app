/* Child component that displays the list of tasks along with a checkbox and an edit and delete button*/

import React from "react";
import { Button, Form } from "react-bootstrap";

// receives props from parent
const TaskList = ({
  tasks,
  handleDeleteTask,
  handleEditTask,
  handleToggleTask,
}) => {
  // if the task list is empty and returns only the heading
  if (!tasks || tasks.length === 0) {
    return <h2>Task List</h2>;
  }

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {/* maps through tasks array and renders a list item*/}
        {tasks.map((task) => (
          <li key={task._id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Check
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task._id)}
              />

              <h4 style={{ marginLeft: "20px", marginRight: "100px" }}>
                {task.title}
              </h4>
              <Button
                onClick={() => handleEditTask(task._id)}
                style={{ marginRight: "15px" }}
              >
                Edit
              </Button>
              <Button onClick={() => handleDeleteTask(task._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
