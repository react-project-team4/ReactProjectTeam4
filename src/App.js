import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import ShowProduct from "./components/ShowProduct";

const Layout = () => {
  const [login, setlogin] = useState("false");
  return (
    <Container>
      <Header login={login} />
      <Outlet />
      <Footer />
    </Container>
  );
};

const App = () => {
  const [user, setUser] = useState("Guest");
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/ShowProduct" element={<ShowProduct user={user} />} />
          {/* <Route path="/login" element={<Login />}></Route> */}
          {/* <Route path="/Register" element={<Register />}></Route> */}
          <Route path="/Login" element="로그인 페이지"></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
