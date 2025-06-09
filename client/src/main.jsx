import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </StrictMode>
  );
} else {
  console.error("Root container not found");
}
