import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Inlined global styles for simplicity. Use a proper CSS setup in a real app.
const globalStyles = `
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  h1, h2 {
    color: #333;
  }
  form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  textarea {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    min-height: 120px;
    box-sizing: border-box; /* Include padding in width */
  }
  button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: 10px;
  }
  li strong {
    display: block;
    margin-bottom: 5px;
    color: #007bff;
    font-size: 1.1em;
  }
  li div {
    font-size: 0.9em;
    color: #555;
    max-height: 150px; /* Limit display height */
    overflow-y: auto;
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 10px;
  }
`;

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <style>{globalStyles}</style> {/* Apply global styles */}
      <RouterProvider router={router} />
    </StrictMode>
  );
}
