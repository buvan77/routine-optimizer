const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal 
  ? "http://localhost:8080" 
  : "https://2zbbtlct-8080.inc1.devtunnels.ms"; // <-- PASTE YOUR 8080 TUNNEL HERE