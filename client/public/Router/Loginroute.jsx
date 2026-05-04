import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <button
      className="btn"
      onClick={() => navigate("/login")}
    >
      Log In / Sign Up
    </button>
  );
}