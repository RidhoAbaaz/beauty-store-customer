import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/global.css';
import { BrowserRouter } from 'react-router-dom';
import Routers from './router/Routers';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routers/>
    </BrowserRouter>
  </StrictMode>,
)
