import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useState } from 'react';
import RefrshHandler from '../RefrshHandler';
import {GoogleOAuthProvider} from "@react-oauth/google"


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const GoogleWrapper = ()=>(
		<GoogleOAuthProvider clientId="21849335516-14jkiec20p15id7uta33b429u1c02npq.apps.googleusercontent.com">
			<Login></Login>
		</GoogleOAuthProvider>
	)

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<GoogleWrapper />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;
