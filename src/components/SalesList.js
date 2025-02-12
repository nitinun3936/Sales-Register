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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    // FUNCTIONALITY FIRST: Ensure real-time database updates
    const unsubscribe = onSnapshot(
      collection(db, "sales"),
      (snapshot) => {
        const salesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSales(salesData);
      },
      (error) => {
        console.error("Error fetching sales:", error);
        toast.error("Failed to load sales. Please try again.");
      }
    );

    return () => unsubscribe();
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
