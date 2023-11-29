import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import useFetch from "./assets/customHooks/useFetch";

const App = () => {
  const fetchData = useFetch;
  async function sendRequestToDb(requestType, url, body) {
    const response = await fetchData(url, {
      method: requestType,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login"></Navigate>} />
        <Route path="/login" element={<Login sendRequestToDb={sendRequestToDb}/>} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/home/:id" element={<Home sendRequestToDb={sendRequestToDb} />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
