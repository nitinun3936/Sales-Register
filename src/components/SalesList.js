import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
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

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [selectedSale, setSelectedSale] = useState(null); // Sale to delete

  useEffect(() => {
    // Set up real-time listener for Firestore
    const unsubscribe = onSnapshot(
      collection(db, "sales"),
      (snapshot) => {
        const salesData = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Include document data
        }));
        setSales(salesData); // Update state
      },
      (error) => {
        console.error("Error fetching sales:", error);
        toast.error("Failed to load sales. Please try again.");
      }
    );

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleOpenDialog = (sale) => {
    setSelectedSale(sale); // Set the sale to delete
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setSelectedSale(null); // Clear the selected sale
    setOpenDialog(false); // Close the dialog
  };

  const handleDelete = async () => {
    if (selectedSale) {
      try {
        await deleteDoc(doc(db, "sales", selectedSale.id));
        toast.success("Sale deleted successfully!");
        handleCloseDialog(); // Close dialog after deletion
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

      {/* Confirmation Dialog */}
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
