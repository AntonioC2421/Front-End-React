import React from "react";
import { Navbar } from "./layouts/Navbar";
import { Router } from "./routes/Routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="DataTables">
        <Router />
      </div>
    </div>
  );
}

export default App;
