import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UpdateProfile from './pages/UpdateProfile.tsx';
import LoginForm from './pages/Login.tsx';
import ProtectedRoute from './context/ProtectedRoutes.tsx';
import UserProfile from './pages/UserProfile.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Signup from './pages/Signup.tsx';
import Header from './components/Header.tsx';
import { AuthContext } from './context/authContext.tsx';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';


const App: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <div>Loading...</div>;

  const {user } = auth;

  return (
    <div className='app-container'>
      {user && <Header></Header>}
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}></Route>

        <Route path="/signup" element={!user ? <Signup></Signup>: <Navigate to="/"></Navigate>} ></Route>

        <Route path="/login" element={!user ? <LoginForm></LoginForm>: <Navigate to="/"></Navigate>}></Route>
        
        <Route path='/:userId' element={<ProtectedRoute><UserProfile></UserProfile></ProtectedRoute>}></Route>
        <Route path='/:userId/update' element={<ProtectedRoute><UpdateProfile></UpdateProfile></ProtectedRoute>}></Route>

      </Routes>

    </div>
    
  );
};

export default App;
