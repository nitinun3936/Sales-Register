import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase"; // Import auth to get current user
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setSales([]); // Clear sales if user logs out
        return; // ✅ Stop execution before trying Firestore query
      }

      // Ensure Firestore fetch runs only after the user is set
      const fetchSales = async () => {
        const salesQuery = query(
          collection(db, "sales"),
          where("ownerId", "==", user.uid)
        );

        const unsubscribeSnapshot = onSnapshot(
          salesQuery,
          (snapshot) => {
            const salesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setSales(salesData);
          },
          (error) => {
            if (auth.currentUser) {
              // ✅ Prevent showing toast if user is null (logged out)
              console.error("Error fetching sales:", error);
              toast.error("Failed to load sales. Please try again.");
            }
          }
        );

        return () => unsubscribeSnapshot(); // Clean up Firestore listener
      };

      fetchSales();
    });

    return () => unsubscribeAuth(); // Clean up Auth listener
  }, []);

  const handleOpenDialog = (sale) => {
    setSelectedSale(sale);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedSale(null);
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    if (selectedSale) {
      try {
        await deleteDoc(doc(db, "sales", selectedSale.id));
        toast.success("Sale deleted successfully!");
        handleCloseDialog();
      } catch (error) {
        console.error("Error deleting sale:", error);
        toast.error("Failed to delete sale. Please try again.");
      }
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Sales List
      </Typography>
      {sales.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          No sales found. Add some to get started!
        </Typography>
      ) : (
        <List>
          {sales.map((sale) => (
            <ListItem
              key={sale.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleOpenDialog(sale)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={sale.product}
                secondary={`Amount: $${sale.amount}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the sale for{" "}
            <strong>{selectedSale?.product}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SalesList;
