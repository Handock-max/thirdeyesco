import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Point d'entrée principal de l'application Third Eyes Co.
 * Initialise React et monte l'application dans le DOM
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("L'élément root n'a pas été trouvé dans le DOM");
}

// Création du root React et rendu de l'application
const root = createRoot(rootElement);
root.render(<App />);
