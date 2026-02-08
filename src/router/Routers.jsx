import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Shop from '../pages/Shop/Shop';
import Favorite from '../pages/Favorite/Favorite';
import Cart from '../pages/Cart/Cart';
import Order from '../pages/Order/Order';
import History from '../pages/History/History';
import DetailPage from '../pages/DetailProduct';
import DetailOrder from '../pages/DetailOrder';
import Checkout from '../pages/Checkout';
import LoginPage from '../pages/Auth/LoginPage';
import UpdatePassword from '../pages/Auth/UpdatePassword';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/ProfilePage';


export default function Routers() {
    const token = localStorage.getItem("token");
    return (
        <Routes>
            <Route path='/' element={ token ? <Navigate to="/home" /> : <Navigate to="/login" /> } />
            <Route path='/home' element={ <Home/> } />
            <Route path='/Shop' element={ <Shop />} />
            <Route path='/Favorite' element={ <Favorite /> } />
            <Route path='/Cart' element={ <Cart /> } />
            <Route path='/Order' element={ <Order /> } />
            <Route path='/History' element={<History /> } />
            <Route path='/Checkout' element={<Checkout /> } />
            <Route path='/Product/:id' element={ <DetailPage/> }/>
            <Route path='/Order/:id' element={ <DetailOrder/> }/>
            <Route path='/login' element= { <LoginPage /> } />
            <Route path='/update' element= { <UpdatePassword /> } />
            <Route path='/register' element= { <RegisterPage /> } />
            <Route path='/profile' element= { <ProfilePage /> } />
        </Routes>
    )
}