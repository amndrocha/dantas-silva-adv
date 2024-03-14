// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Card from './Card.jsx'; // Assuming you renamed Alternate.jsx to Card.jsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/card/:id" element={<Card />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);


