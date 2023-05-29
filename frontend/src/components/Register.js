/* Child component that renders a registration form*/

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const Register = ({ handleRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // calls the function with the username and password as arguments
    handleRegister(username, password);
    // resets to empty strings
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Register</h2>
      <Form className="register" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          className="form-control"
          value={username}
          // updates the states with the new values
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="btn btn-primary"
          type="submit"
          style={{ marginTop: "12px", marginLeft: "7px" }}
        >
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
