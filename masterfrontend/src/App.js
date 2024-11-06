import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartialHome from './components/PartialHome';
import AppointmentForm from './components/AppointmentForm';
import VetForm from './components/VetForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PartialHome />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/vet" element={<VetForm />} />
      </Routes>
    </Router>
  );
};

export default App;
