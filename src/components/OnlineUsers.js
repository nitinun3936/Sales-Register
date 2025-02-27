import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../firebase";
import { List, ListItem, Typography } from "@mui/material";

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(realtimeDB, "onlineUsers");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        setOnlineUsers(Object.values(snapshot.val()));
      } else {
        setOnlineUsers([]);
      }
    });

    return () => unsubscribe();
  }, []); // Removed `auth.currentUser` dependency

  return (
    <div>
      <Typography variant="h6">User Online</Typography>
      <List>
        {onlineUsers.map((user, index) => (
          <ListItem key={index}>{user.email}</ListItem>
        ))}
      </List>
    </div>
  );
};

export default OnlineUsers;
