import React, { useState } from 'react';
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyPage from './components/MypageComponents/MyPage';

import React, { useState } from "react";
import Header from "./front-end/components/Header";
import Footer from "./front-end/components/Footer";
import Main from "./front-end/components/Main";
import ProductList from "./front-end/components/ProductList";
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
    <>
      <Router>
        <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<Main />} />
            <Route path="/showProduct" element={<ShowProduct user={user} />} />
            <Route path="/productList" element={<ProductList />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}


export default App;