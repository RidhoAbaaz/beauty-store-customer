import { useContext, useEffect, useState } from 'react';
import styles from './Toolbar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RequestHandler } from '../../helper/RequestHandler';
import { BaseUrl } from '../../context/BaseUrl';
import LoadingCard from '../Card/LoadingCard/LoadingCard';
import ErrorCard from '../Card/ErrorCard/ErrorCard';

export default function Toolbar({ trigger }) {
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const baseUrl = useContext(BaseUrl);
    const navigation = useNavigate();

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response  = await RequestHandler(`${baseUrl}/toolbar`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setFavoriteCount(response.favoriteCount);
                setCartCount(response.cartCount);
            } catch (error) {
                if (error.message === "token not found") {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                        navigation('/login');
                    }, 3000)
                }
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [baseUrl, navigation, trigger])


    const location = useLocation();
    return (
        <div className={styles.toolbar}>
            <h3>Beauty Store</h3>
            <Link to="/Cart" state={{ from: location.pathname }} className={styles.cart} style={{ "--cart-length": `"${cartCount}"` }}>
                <i className="bi bi-cart"></i>
            </Link>
            <Link to="/Favorite" state={{ from: location.pathname }} className={styles.favorite} style={{ "--favorite-length": `"${favoriteCount}"` }}>
                <i className="bi bi-heart"></i>
            </Link>
            <Link to="/profile" className={styles.profile}>
                <i className="bi bi-person-circle"></i>
            </Link>
            { loading && <LoadingCard /> }
            { errorMessage && <ErrorCard message={errorMessage} /> }
        </div>
    )
}