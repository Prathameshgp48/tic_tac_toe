import { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import GameBox from "./pages/GameBox.jsx";
import MatchHistory from "./pages/MatchHistory.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./pages/UserProfile.jsx";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game/:gameId" element={<GameBox />} />
        <Route path="/history" element={<MatchHistory />} />
        <Route path="/profile" element={<UserProfile/>}/>
      </Routes>
    </>
  );
}

export default App;
