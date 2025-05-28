import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    {/* <StrictMode> */}
      <SpeedInsights />
      <App />
    {/* </StrictMode> */}
  </>
);
