import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login"></Navigate>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/home/:id" element={<Home />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
