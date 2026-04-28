import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';
import Home from './pages/Home';
import { useState } from 'react';
import RefrshHandler from '../RefrshHandler';
import {GoogleOAuthProvider} from "@react-oauth/google"
import UploadReel from './pages/UploadReel';
import ReelsView from './pages/ReelsView';
import MyReels from './pages/MyReels';
import MyOrders from './pages/MyOrders';
import MenuManagement from './pages/MenuManagement';
import Navbar from './components/Navbar';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const GoogleWrapper = ()=>(
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Login></Login>
		</GoogleOAuthProvider>
	)

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  const FoodPartnerRoute = ({ element }) => {
    const userRole = localStorage.getItem('userRole');
    return isAuthenticated && userRole === 'foodpartner' ? element : <Navigate to="/reels" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/reels" />} />
        <Route path='/login' element={<GoogleWrapper />} />
        <Route path='/role-selection' element={<RoleSelection />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/food' element={<FoodPartnerRoute element={<UploadReel />} />} />
        <Route path='/my-reels' element={<FoodPartnerRoute element={<MyReels />} />} />
        <Route path='/menu' element={<FoodPartnerRoute element={<MenuManagement />} />} />
        <Route path='/my-orders' element={<PrivateRoute element={<MyOrders />} />} />
        <Route path='/reels' element={<ReelsView />} />
      </Routes>
    </div>
  );
}

export default App;
