import { useContext, useEffect, useState } from 'react';
import styles from '../../assets/styles/History/History.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import HistoryCard from '../../components/Card/HistoryCard/HistoryCard';
import Toolbar from '../../components/Toolbar/Toolbar';
import NavBar from '../../components/Sidebar/NavBar';
import NavButton from '../../components/Button/NavButton';
import { RequestHandler } from '../../helper/RequestHandler';
import { BaseUrl } from '../../context/BaseUrl';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigation = useNavigate();

    const baseUrl = useContext(BaseUrl);
    
    useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await RequestHandler(`${baseUrl}/history`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setHistory(response.histories);
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

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter') || "";
    
    const sortBy = (data, method) => {
        const copy = [...data];
        if (method === "") {
            return copy.sort((first, second) => new Date(second.tanggal) - new Date(first.tanggal));
        }
        else if (method === "old") {
            return copy.sort((first, second) => new Date(first.tanggal) - new Date(second.tanggal));
        }
        else {
            return copy.sort((first, second) => first.harga - second.harga);
        }
    }
    const dropDownHandler = (value) => {
        const newParams = new URLSearchParams(location.search);
        newParams.set('filter', value);
        navigation(`/History?${newParams.toString()}`);
    };

    const sortData = sortBy(history, filter);
    if (!sortData) {
        return
    }

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    history.length === 0 ? (
                        <main className={styles.emptyCart}>
                            <p>Kamu belum pernah beli apa apa, yuk buruan tambah produknya</p>
                            <NavButton teks="Add Now" height="30px" width="100px" path="/Shop">
                                <i className="bi bi-plus-circle"></i>
                            </NavButton>
                        </main>
                    ) : (
                        <main className={styles.container}>
                            <div className={styles.topContent}>
                                <p className={styles.resultInfo}>{ history.length } Recent Order</p>
                                <div className={styles.filterWrapper}>
                                    <label>Sort By :</label>
                                    <select name="filter" id="filter" value={filter} onChange={(e) => dropDownHandler(e.target.value)} className={styles.sortSelect}>
                                        <option value="">Terbaru</option>
                                        <option value="old">Terlama</option>
                                        <option value="cheap">Termurah</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.cardWrapper}>
                                {
                                    sortData.map(item => 
                                        <HistoryCard
                                            key={item.history_id}
                                            productId={item.product_id}
                                            nama={item.name}
                                            brand={item.brand}
                                            varian={item.variant}
                                            price={item.price}
                                            qty={item.qty}
                                            imageUrl={item.image_url}
                                            setLoading={setLoading}
                                            setErrorMessage={setErrorMessage}
                                        />
                                    )
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