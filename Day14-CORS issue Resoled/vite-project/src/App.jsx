import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './App.css'
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";

function App() {

  // code likhna isAuthenticate agr hua to direct home page pr
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch]) 
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signup" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
      </Routes>
    </>
  )
}

export default App
