import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartialHome from './components/PartialHome';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';
import MedicalRecordForm from './components/MedicalRecordForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PartialHome />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/vet" element={<VetForm />} />
        <Route path="/medicalrecord" element={<MedicalRecordForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;
