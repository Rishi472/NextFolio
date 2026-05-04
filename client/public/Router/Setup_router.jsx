import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Auth from "./Auth";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="client\src\Login\Login.jsx" element={<div>Log In / Sign Up</div>} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}