import { useContext, useEffect, useState } from 'react';
import styles from '../../assets/styles/Order/Order.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrderCard from '../../components/Card/OrderCard/OrderCard';
import Toolbar from '../../components/Toolbar/Toolbar';
import NavBar from '../../components/Sidebar/NavBar';
import NavButton from '../../components/Button/NavButton';
import { RequestHandler } from '../../helper/RequestHandler';
import { BaseUrl } from '../../context/BaseUrl';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';

export default function Order() {
    const [orders, setOrders] = useState([]);

    const location = useLocation()
    const navigation = useNavigate();
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter') || "";

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/userOrder`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setOrders(response.orders)
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
    }, [baseUrl,navigation]);

    const filteredOrder = orders.filter(item => { 
        return (
            (filter ? item.status === filter : true)
        );
    });

    const dropDownHandler = (value) => {
        const newParams = new URLSearchParams(location.search);
        newParams.set('filter', value);
        navigation(`/Order?${newParams.toString()}`);
    }

    const listStatus = [...new Set(orders.map(item => item.status))];

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    orders.length === 0 ? (
                        <main className={styles.emptyCart}>
                            <p>waduh, kamu belum beli apa apa nich, yuk buruan beli produknya</p>
                            <NavButton teks="Add Now" height="30px" width="100px" path="/Shop">
                                <i className="bi bi-plus-circle"></i>
                            </NavButton>
                        </main>
                    ) : (
                    <main className={styles.container}>
                        <div className={styles.topContent}>
                            <p className={styles.resultInfo}>{ orders.length } Waiting Orders</p>
                            <div className={styles.filterWrapper}>
                                <label>Status :</label>
                                <select name="filter" id="filter" value={filter} onChange={(e) => dropDownHandler(e.target.value)} className={styles.sortSelect}>
                                    <option value="">All Order</option>
                                    {
                                        listStatus.map((item, index) => <option key={index} value={item}>{ item }</option> )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={styles.cardWrapper}>
                            {
                                filteredOrder.map(
                                    item => 
                                    <Link key={item.order_id} to={`/Order/${item.order_id}`} style={{ textDecoration: "none", color: "black" }} state={{ from: location.pathname + location.search }}>
                                        <OrderCard 
                                            orderID={item.order_id} 
                                            status={item.status}
                                            date={item.craete_at}
                                            payment={item.payment}
                                            totalProduct={item.total_product}
                                            totalItem={item.total_item}
                                            price={item.total_price}
                                        />
                                    </Link>
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