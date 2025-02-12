import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";

const SalesForm = () => {
  const [sale, setSale] = useState({ product: "", amount: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FUNCTIONALITY FIRST: Ensure data validation before submitting
    if (!sale.product || !sale.amount) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      // FUNCTIONALITY FIRST: Store the sales record in Firestore
      await addDoc(collection(db, "sales"), {
        product: sale.product.trim(),
        amount: parseFloat(sale.amount),
        timestamp: new Date(),
      });

      // Reset form fields after successful submission
      setSale({ product: "", amount: "" });

      toast.success("Sale added successfully!");
    } catch (error) {
      console.error("Error adding sale: ", error);
      toast.error("Failed to add sale. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Product"
        value={sale.product}
        onChange={(e) => setSale({ ...sale, product: e.target.value })}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Amount"
        type="number"
        value={sale.amount}
        onChange={(e) => setSale({ ...sale, amount: e.target.value })}
        fullWidth
        margin="normal"
        required
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button type="submit" variant="contained">
          Add Sale
        </Button>
      </Box>
    </Box>
  );
};

export default SalesForm;
