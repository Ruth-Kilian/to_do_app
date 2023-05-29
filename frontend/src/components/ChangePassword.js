/* This child component allows the user to change their password only after they've logged in for authentication purposes.*/

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ChangePasswordForm = () => {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      // sends PUT request to API with token
      const response = await fetch("http://localhost:8080/users/change", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        setUsername("");
        setCurrentPassword("");
        setNewPassword("");
      } else if (response.status === 401) {
        alert(`Error: ${data.message}`);
      } else {
        console.log(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container3">
      <h2>Change Password</h2>
      <Form onSubmit={handleChangePassword}>
        <div className="change-form">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Current Password:</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <Button
          style={{ marginTop: "15px", marginLeft: "5px" }}
          variant="primary"
          type="submit"
        >
          Change Password
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
