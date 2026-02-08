import { useContext, useEffect, useState } from 'react';
import styles from '../../assets/styles/Favorite/Favorite.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/Card/ProductCard/ProductCard';
import NavBar from "../../components/Sidebar/NavBar";
import Toolbar from '../../components/Toolbar/Toolbar';
import NavButton from '../../components/Button/NavButton';
import { RequestHandler } from '../../helper/RequestHandler';
import { BaseUrl } from '../../context/BaseUrl';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';

export default function Favorite() {
    const [ search, setSearch ] = useState("");
    const [ favorite, setFavorite ] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter') || "";

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const baseUrl = useContext(BaseUrl);
    const navigation = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/favorite`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFavorite(response.favorites);
            } catch (error) {
                if (error.message === "token not found") {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage("");
                    navigation("/login")
                }, 3000);
                } else {
                    setErrorMessage(error.message);
                    setTimeout(() => setErrorMessage(""), 3000);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [baseUrl, navigation]);

    const sortBy = (data, method) => {
        const copy = [...data];
        if (method === "") {
            return copy.sort((first, second) => new Date(second.created_at) - new Date(first.created_at));
        }
        else if (method === "old") {
            return copy.sort((first, second) => new Date(first.created_at) - new Date(second.created_at));
        }
        else {
            return copy.sort((first, second) => first.price - second.price);
        }
    }
    
    const sortData = sortBy(favorite, filter);
    const input = search.toLowerCase().trim();
    const filteredProduct = sortData.filter(item => { 
        return (
            (input ? item.nama.toLowerCase().includes(input.toLowerCase()) : true)
        );
    });
    
    const dropDownHandler = (value) => {
        const newParams = new URLSearchParams(location.search);
        newParams.set('filter', value);
        navigate(`/Favorite?${newParams.toString()}`);
    }
    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    favorite.length === 0 ? (
                        <main className={styles.empty}>
                            <p>Belum ada product yang terdaftar, silahkan tambah product</p>
                            <NavButton teks="Add Now" height="30px" width="100px" path="/Shop">
                                <i className="bi bi-plus-circle"></i>
                            </NavButton>
                        </main>
                    ) : (
                        <main className={styles.container}>
                            <h3>Your Favorite Product</h3>
                            <div className={styles.topContent}>
                                <p className={styles.resultInfo}>{ favorite.length } Favorite Product</p>
                                <div className={styles.filterWrapper}>
                                    <label>Sort By :</label>
                                    <select name="filter" id="filter" value={filter} onChange={(e) => dropDownHandler(e.target.value)} className={styles.sortSelect}>
                                        <option value="">Terbaru</option>
                                        <option value="old">Terlama</option>
                                        <option value="cheap">Termurah</option>
                                    </select>
                                    <div className={styles.inputWrap}>
                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search product' className={styles.searchWrapper}/>
                                        {search === "" ? null : <i className="bi bi-x-circle" onClick={() => setSearch("")} style={{ cursor: "pointer" }}></i>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardWrapper}>
                                {
                                    filteredProduct.map(item => (
                                        <Link key={item.product_id} to={`/product/${item.product_id}`} style={{ textDecoration: "none", color: "black" }} state={{ from: location.pathname + location.search }}>
                                            <ProductCard name={item.name} brand={item.brand} price={item.price} varian={item.variant} image_url={item.image_url}/>
                                        </Link>
                                    ))
                                }
                            </div>
                        </main>
                    )
                )
            }
            { errorMessage && <ErrorCard message={errorMessage} /> }
        </section>
    )
}
