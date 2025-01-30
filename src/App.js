import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";
import SalesForm from "./components/SalesForm";
import SalesList from "./components/SalesList";

function App() {
  return (
    <Container>
      <h1>Sales Register</h1>
      <SalesForm />
      <SalesList />
      {/* Add the ToastContainer */}
      <ToastContainer position="bottom-center" autoClose={2000} />
    </Container>
  );
}

export default App;
