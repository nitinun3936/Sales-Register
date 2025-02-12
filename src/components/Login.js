import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { TextField, Button, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        // Attempt login directly without pre-checking
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful!");
      }
      onLogin(); // Notify App.js
    } catch (error) {
      console.error("Firebase Auth Error:", error.code); // Debugging

      // Specific error handling
      if (error.code === "auth/user-not-found") {
        toast.error("User not registered.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Password is incorrect."); // In this handleAuth function, despite hard attempts, could not implement user not registered and email/password wrong simultaneously. Is this a drawback?
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(error.message); // Default Firebase error
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, textAlign: "center" }}>
      <Typography variant="h5">
        {isRegistering ? "Register" : "Login"}
      </Typography>
      <form onSubmit={handleAuth}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {isRegistering ? "Register" : "Login"}
        </Button>
      </form>
      <Button onClick={() => setIsRegistering(!isRegistering)} sx={{ mt: 2 }}>
        {isRegistering
          ? "Already have an account? Login"
          : "New user? Register"}
      </Button>
    </Box>
  );
};

export default Login;
