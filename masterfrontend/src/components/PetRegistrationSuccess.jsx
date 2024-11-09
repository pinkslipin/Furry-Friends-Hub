import React from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function PetRegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Paper
        style={{
          padding: "2em",
          textAlign: "center",
          backgroundColor: "#FFBE98",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#125B9A", fontWeight: 600 }}>
          Pet Successfully Registered!
        </Typography>
        <Typography variant="body1" style={{ color: "#0B8494", marginBottom: "1.5em" }}>
          Thank you for registering your pet with us. You can now add another pet or view the list of registered pets.
        </Typography>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#F05A7E",
            color: "white",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "0.8em 2em",
            borderRadius: "5px",
            marginRight: "10px",
          }}
          onClick={() => navigate("/")}
        >
          Register Another Pet
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#125B9A",
            color: "white",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "0.8em 2em",
            borderRadius: "5px",
          }}
          onClick={() => navigate("/petlist")}
        >
          View Pet List
        </Button>
      </Paper>
    </Container>
  );
}

export default PetRegistrationSuccess;
