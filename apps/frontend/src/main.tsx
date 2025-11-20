import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Export the types directly
export * from './context/models/types';

const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
