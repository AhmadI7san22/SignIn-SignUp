import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PrivateRoute from './privateRoute';

function App() {
  const token = localStorage.getItem('authToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />} />
        <Route 
          path='/login' 
          element={token ? <Navigate to="/home" /> : <Login />} 
        />
        <Route 
          path='/home' 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
