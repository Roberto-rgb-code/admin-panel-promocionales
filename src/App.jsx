// admin-panel-promocionales/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PromocionalesList from './components/PromocionalesList';
import PromocionalesForm from './components/PromocionalesForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PromocionalesList />} />
        <Route path="/nuevo" element={<PromocionalesForm />} />
        <Route path="/editar/:id" element={<PromocionalesForm />} />
      </Routes>
    </Router>
  );
}

export default App;