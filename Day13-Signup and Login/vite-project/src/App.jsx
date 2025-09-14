import { Routes, Route } from "react-router";
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
    dispatch(checkAuth)
  }, [isAuthenticated])
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
