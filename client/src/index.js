import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UseProvider from "./context/UseProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UseProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </UseProvider>
);
