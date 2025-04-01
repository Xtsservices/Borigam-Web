import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/signup.tsx';
import Loginform from './components/login.tsx';
import ForgotPassword from './components/forgotPassword.tsx';
import Dashboard from './components/dashboard.tsx';
import ViewCourse from './components/viewCourse.tsx';

const App: React.FC = () => {
  console.log("qwertyuio")
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/" element={<Loginform />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-course/:courseId" element={<ViewCourse />} />
      </Routes>
    </Router>
  );
};



export default App
