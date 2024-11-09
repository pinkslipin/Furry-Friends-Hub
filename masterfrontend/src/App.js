import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartialHome from './components/PartialHome';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';
import PetForm from './components/PetForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PartialHome />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/vet" element={<VetForm />} />
        <Route path="/pet" element={<PetForm />} />
      </Routes>
    </Router>
  );
};

export default App;
