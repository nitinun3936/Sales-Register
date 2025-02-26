import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
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
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful!");
      }
      onLogin();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("User not registered.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Password is incorrect.");
      } else {
        toast.error("Invalid email or password.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      setTimeout(() => {
        onLogin();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Facebook login successful!");
      onLogin();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("GitHub login successful!");
      onLogin();
    } catch (error) {
      toast.error(error.message);
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
      <Button onClick={handleGoogleSignIn} fullWidth sx={{ mt: 2 }}>
        Login with Google
      </Button>
      <Button onClick={handleFacebookSignIn} fullWidth sx={{ mt: 2 }}>
        Login with Facebook
      </Button>
      <Button onClick={handleGitHubSignIn} fullWidth sx={{ mt: 2 }}>
        Login with GitHub
      </Button>
      <Button onClick={() => setIsRegistering(!isRegistering)} sx={{ mt: 2 }}>
        {isRegistering
          ? "Already have an account? Login"
          : "New user? Register"}
      </Button>
    </Box>
  );
};

export default Login;
