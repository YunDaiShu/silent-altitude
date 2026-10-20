import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import site from './site.config';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

// Warm the card faces before the hero video takes the bandwidth. The 3D card
// builds its textures from these exact URLs, so this fills the same cache
// entries; a <link rel=preload> in index.html would be rewritten by Vite into a
// different hashed URL and download the files twice.
for (const url of [site.assets.lanyardFront, site.assets.lanyardBack, site.assets.lanyardStrap]) {
  if (url) new Image().src = url;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
