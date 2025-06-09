import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './pages/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';  
import UserProfile from './pages/UserProfile';
import Universities from './pages/Universities';  
import UniversityDetails from './pages/UniversityDetails';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Dashboard from './pages/Dashboard';
import SetupProfile from './pages/SetupProfile';
import Layout from './components/Layout';
import Recommendations from './pages/Recommendations'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes within Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Public Pages */}
          <Route path="universities" element={<Universities />} />
          <Route path="universities/:id" element={<UniversityDetails />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetails />} />

          {/* Private Routes */}
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="setup-profile" element={<PrivateRoute><SetupProfile /></PrivateRoute>} />
          <Route path="recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} /> {/* ✅ New Route */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
