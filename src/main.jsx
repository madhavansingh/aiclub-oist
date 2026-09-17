import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactLenis } from "@studio-freight/react-lenis";
const lenisOptions = {
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1.0,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactLenis root options={lenisOptions}>
      <App />
    </ReactLenis>
  </React.StrictMode>,
)