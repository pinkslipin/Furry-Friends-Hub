// src/components/PartialHome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PartialHome.css'; // Import CSS for styling

const Home = () => {
  const navigate = useNavigate();

  const handleAppointment = () => {
    navigate('/appointment'); // Navigate to AppointmentForm
  };

  const handleVet = () => {
    navigate('/vet'); // Navigate to VetForm
  };

  const handleMedRec = () => {
    navigate('/medicalrecord'); //Nav to MedicalRecordForm
  }

  return (
    <div className="home-container">
      <h1>Appointment & Vet</h1>
      <div className="button-container">
        <button className="nav-button" onClick={handleAppointment}>Go to Appointment Form</button>
        <button className="nav-button" onClick={handleVet}>Go to Vet Form</button>
      </div>

      <h1>Medical Record</h1>
      <div className="button-container">
        <button className="nav-button" onClick={handleMedRec}>Go to Medical Record Form</button>
      </div>
    </div>
  );
};

export default Home;
