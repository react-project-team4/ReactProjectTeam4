import React, { useState } from "react";
import Header from "./front-end/components/Header";
import Footer from "./front-end/components/Footer";
import Main from "./front-end/components/mainComponents/Main";
import ProductList from "./front-end/components/productListComponents/ProductList";
import Register from "./front-end/components/Register";
import Login from "./front-end/components/Login";
import CreateProduct from "./front-end/components/productListComponents/CreateProduct";
import UpdateProduct from "./front-end/components/productListComponents/UpdateProduct";
//admin
import ManageSeller from "./front-end/components/adminMange/ManageSeller"
import ManageBuyer from "./front-end/components/adminMange/ManageBuyer" 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import ShowProduct from "./front-end/components/productListComponents/ShowProduct";
import MyPage from "./front-end/components/mypageComponents/MyPage";
import styles from "./front-end/css/app.module.css";



const Layout = (props) => {
  const { user, setUser } = props;
  return (
    <>
      <Header user={user} setUser={setUser} />
      <Container className={styles.background}>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

const App = () => {
  const UserType =
    localStorage.getItem("UserType") === null
      ? "Guest"
      : localStorage.getItem("UserType");

  const [user, setUser] = useState(UserType);

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<Main />} />
          <Route path="/ShowProduct" element={<ShowProduct user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ProductList" element={<ProductList user={user} />} />
          <Route path="/CreateProduct" element={<CreateProduct />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/UpdateProduct" element={<UpdateProduct />} />
          <Route path="/ManageSeller" element={<ManageSeller/>} />
          <Route path="/ManageBuyer" element={<ManageBuyer/>} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;