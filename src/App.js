import React, { useState } from "react";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowProduct from "./components/ShowProduct";

const App = () => {
  const [user, setUser] = useState("Guest");
  return (
    <Router>
      <Header login={user} />
      <Routes>
        <Route path="/showProduct" element={<ShowProduct user={user} />} />
        <Route path="/login" element="로그인페이지"></Route>
      </Routes>
    </Router>
  );
};

export default App;
