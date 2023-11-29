import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import { useState } from "react";

const App = () => {
  const [showPost, setShowPost] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login"></Navigate>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <Layout setShowPost={setShowPost} setShowAlbum={setShowAlbum} />
          }
        >
          <Route path="/home/:id" element={<Home />}>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

