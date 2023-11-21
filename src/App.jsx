import React, { useState } from "react";
import Header from "./front-end/components/Header";
import Footer from "./front-end/components/Footer";
import Main from "./front-end/components/Main";
import ProductList from "./front-end/components/ProductList";
import CreateProduct from "./front-end/components/CreateProduct";
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
import MyPage from "./front-end/components/MypageComponents/MyPage";

const Layout = (props) => {
  const { user, setUser } = props;
  return (
    <Container>
      <Header user={user} setUser={setUser} />
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
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<Main />} />
          <Route path="/ShowProduct" element={<ShowProduct />} />
          <Route path="/login" element={<Login setUser={setUser} />}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/MyPage" element={<MyPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
