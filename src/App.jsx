import React, { useState } from "react";
import Header from "./front-end/components/Header";
import Footer from "./front-end/components/Footer";
import Main from "./front-end/components/Main";
import ProductList from "./front-end/components/ProductList";
import Register from "./front-end/components/Register";
import Login from "./front-end/components/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import ShowProduct from "./front-end/components/ShowProduct";

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
          <Route path="/ShowProduct" element={<ShowProduct />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/Login" element="로그인 페이지"></Route>
          <Route path="/ProductList" element={<ProductList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
