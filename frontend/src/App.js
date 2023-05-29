/* The Parent component manages the state of the application, handles user registration and login,
and interacts with a backend API to perform CRUD operations on tasks.*/

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Login from "./components/Login";
import Register from "./components/Register";
import ChangePassword from "./components/ChangePassword";
import "./App.css";

const App = () => {
  // indicates whether the user is logged in or not -> initial state is false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // list of tasks
  const [tasks, setTasks] = useState([]);
  // task being edited
  const [editTask, setEditTask] = useState(null);

  // function to handle registering a user
  const handleRegister = async (username, password) => {
    try {
      // sends a POST request to the API with the username and password
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // response status and messages and alerts for the user
      if (response.status === 200) {
        console.log("User registered successfully.");
        alert("User registered successfully.");
      } else if (response.status === 400) {
        const data = await response.json();
        console.log("Registration failed:", data.error);
        alert("Registration failed!");
      } else if (response.status === 403) {
        console.log("Registration forbidden: User not allowed.");
        alert("Registration forbidden: Username has to end with '@gmail.com'.");
      } else {
        console.log("Registration failed with status:", response.status);
        alert("Username already exists!");
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  // function to handle logging in a user
  const handleLogin = async (username, password) => {
    try {
      // sends a POST request to the API with the username and passowrd
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        // saves the authentication token in local storage
        localStorage.setItem("token", data.token);
        // sets the logged in state to true -> displays the logged in view
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        alert("Login failed: Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login forbidden: Username has to end with '@gmail.com'.");
    }
  };

  // only fetched the tasks once the user has logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchTasks = async () => {
        try {
          // retrive token from storage
          const token = localStorage.getItem("token");

          // GET request to API along with the token to authorise user
          const response = await fetch("http://localhost:8080/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          // if there are tasks set the state
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchTasks();
    }
  }, [isLoggedIn]);

  const addTask = async (title) => {
    try {
      // get token
      const token = localStorage.getItem("token");

      // sends POST request to APT with token and task
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (response.status === 400) {
        alert("Task exceeds 140 character limit!");
      } else if (response.status === 415) {
        throw new Error("Error adding task");
      } else if (response.status === 500) {
        alert("Input is not JSON content!");
      }

      if (response.ok) {
        const newTask = await response.json();
        // updates the tasks state with the new task
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else {
        throw new Error("Error adding task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // sends DELETE request to API with the task ID
      await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      // updates the tasks sate by filtering out the deleted task
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    // sets the sate to the task that matches the given task ID
    if (taskToEdit) {
      setEditTask(taskToEdit);
    }
  };

  // cancels the editing of a task by resetting the state to null
  const handleCancelEdit = () => {
    setEditTask(null);
  };

  const handleUpdateTask = async (updatedTitle) => {
    try {
      // Destructures the _id property from the editTask object into a variable taskId.
      const { _id: taskId } = editTask;
      // sends PUT request to API with task ID and updated information
      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTitle,
          completed: editTask.completed,
        }),
      });
      const updatedTask = await response.json();
      // updates the state by mapping over the array and replacing the task with the matching ID with the update
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
      // sets it back to null so that the add task form is displayed
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      // creates a new array ny mapping over the tasks array and toggling the staus of the task
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      );

      // updates the state
      setTasks(updatedTasks);

      // sends a PUT request to the API with the taskID
      await fetch(`http://localhost:8080/tasks/${taskId}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // contains the updated completed status
        body: JSON.stringify(updatedTasks.find((task) => task._id === taskId)),
      });
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  // allow the user to logout
  const handleLogout = () => {
    // Perform necessary tasks for logout, such as clearing tokens, resetting states, etc.
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <div>
      <h1>To-Do List App</h1>

      {/* if user is logged in then the task form and list is rendred */}
      {isLoggedIn ? (
        <>
          <Button
            style={{ position: "absolute", top: "15px", right: "20px" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
          {editTask ? (
            <TaskForm
              addTask={handleUpdateTask}
              initialTitle={editTask.title}
              onCancel={handleCancelEdit}
            />
          ) : (
            <TaskForm addTask={addTask} />
          )}
          <TaskList
            tasks={tasks}
            handleDeleteTask={handleDeleteTask}
            handleEditTask={handleEditTask}
            handleToggleTask={handleToggleTask}
          />
          <ChangePassword />
        </>
      ) : (
        // if user is not logged in then the  register and login is rendred
        <>
          <div className="container">
            <Register handleRegister={handleRegister} />
            <h2>OR</h2>
            <Login handleLogin={handleLogin} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
