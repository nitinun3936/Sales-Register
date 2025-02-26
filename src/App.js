import React, { useEffect, useState } from "react";
import { auth, realtimeDB } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, set, onDisconnect } from "firebase/database"; // Correct imports
import { Button, Container, Box, Typography } from "@mui/material";
import Login from "./components/Login";
import SalesForm from "./components/SalesForm";
import SalesList from "./components/SalesList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  //  Single useEffect for Authentication & Online Status
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Reference to the online users node in Realtime Database
        const userRef = ref(realtimeDB, `onlineUsers/${user.uid}`);

        // Mark user as online
        set(userRef, { email: user.email, online: true });

        // Remove user from online list when they disconnect
        onDisconnect(userRef).remove();

        //  Immediately fetch online users after login
        const onlineUsersRef = ref(realtimeDB, "onlineUsers");
        onValue(onlineUsersRef, (snapshot) => {
          if (snapshot.exists()) {
            setOnlineUsers(snapshot.val());
          } else {
            setOnlineUsers({});
          }
        });
      }
    });

    return () => unsubscribeAuth(); // Clean up Auth listener when component unmounts
  }, []);

  // Separate useEffect to Listen to Online Users in Realtime
  useEffect(() => {
    const onlineUsersRef = ref(realtimeDB, "onlineUsers");

    // Listen for changes in real-time
    const unsubscribeUsers = onValue(onlineUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        setOnlineUsers(snapshot.val());
      } else {
        setOnlineUsers({});
      }
    });

    return () => unsubscribeUsers(); // Clean up listener when unmounting
  }, []);

  const handleLogout = async () => {
    if (user) {
      // Remove user from online list before logging out
      const userRef = ref(realtimeDB, `onlineUsers/${user.uid}`);
      set(userRef, null);
    }

    await signOut(auth);
    setUser(null);
  };

  return (
    <Container>
      {user ? (
        <>
          {/* Header */}
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

          {/* Display Online Users */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Online Users:</Typography>
            {Object.values(onlineUsers).length > 0 ? (
              <ul>
                {Object.entries(onlineUsers).map(([uid, user]) => (
                  <li key={uid}>{user.email}</li>
                ))}
              </ul>
            ) : (
              <Typography>No users online</Typography>
            )}
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
