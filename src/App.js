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
import MyPage from "./components/MypageComponents/MyPage";

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
          <Route path="/showProduct" element={<ShowProduct user={user} />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/myPage" element={<MyPage/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;