import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button, Container, Box, Typography } from "@mui/material";
import Login from "./components/Login";
import SalesForm from "./components/SalesForm";
import SalesList from "./components/SalesList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Container>
      {user ? (
        <>
          {/* Proper Header Layout */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Sales Register
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {/* Sales Form and List */}
          <SalesForm />
          <SalesList />
        </>
      ) : (
        <Login onLogin={() => setUser(auth.currentUser)} />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default App;
