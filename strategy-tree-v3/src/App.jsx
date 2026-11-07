import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Editor from "../pages/Editor";
import Guide from "../pages/Guide";
import Login from "../pages/Login";
import Plans from "../pages/Plans";

export default function App() {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* "/" works without an account (guest draft); saving asks you to log in */}
            <Route path="/" element={<Editor />} />
            <Route path="/plan/:planId"element={<ProtectedRoute><Editor /></ProtectedRoute>}/>
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
