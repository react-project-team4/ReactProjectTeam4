import React, { useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const Layout = () => {
  const [login, setlogin] = useState('false');
  return (
    <Container>
      <Header login={login} />
      <Outlet />
      <Footer />
    </Container>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={<Main />} />
        </Route>
      </Routes>
    </Router >
  )
}


export default App;
