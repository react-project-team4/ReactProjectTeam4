import React, { useState } from 'react';
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyPage from './components/MypageComponents/MyPage';


const App = () => {
  const [login, setlogin] = useState('false');
  return (
    <>
    <Router>
      <Header login={login} />
      <Routes>
        <Route path='/' element="" />
      </Routes>
    </Router>
    
    <MyPage/>
    </>
  )
}


export default App;