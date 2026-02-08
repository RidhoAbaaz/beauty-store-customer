import { useLocation, useParams } from 'react-router-dom';
import styles from '../assets/styles/DetailOrder.module.css';
import OrderItem from '../components/Card/OrderItem/OrderItem';
import SummaryRow from '../components/Row/Summary/SummaryRow';
import { useContext, useEffect, useState } from 'react';
import NavButton from '../components/Button/NavButton';
import ExpRow from '../components/Row/ExpRow/ExpRow';
import Toolbar from '../components/Toolbar/Toolbar';
import NavBar from '../components/Sidebar/NavBar';
import Info from '../components/Info/Info';
import { BaseUrl } from '../context/BaseUrl';
import { RequestHandler } from '../helper/RequestHandler';
import LoadingCard from '../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../components/Card/ErrorCard/ErrorCard';

export default function DetailOrder() {
    const [order, setOrder] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const { id } = useParams();

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/order/${id}`)
                setOrder(response.order);
            } catch (error) {
                setIsError(error.message);
                setTimeout(() => setIsError(""), 3000)
            } finally {
                setIsLoading(false)
            }
        }
        fetchContent();
    }, [baseUrl, id]);

    const location = useLocation()
    const from = location.state?.from || "";

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    const statusKey = (order.status || "").toLowerCase();

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                isLoading ? <LoadingCard /> : (
                    <main className={styles.container}>
                        {/* container 1 */}
                        <div className={styles.toolbar}>
                            <p>{ order.order_id }</p>
                            <span className={`${styles.statusBadge} ${styles[`badge_${statusKey}`] || ""}`}>
                                {order.status}
                            </span>
                        </div>
                        {/* container 2 */}
                        <div className={styles.itemWrap}>
                            {
                                order.orderItem && order.orderItem.map(item => 
                                    <OrderItem
                                        key={item.product_id} 
                                        nama={item.name} 
                                        brand={item.brand}
                                        price={item.price}
                                        varian={item.variant}
                                        qty={item.qty}
                                        total={item.sub_total}
                                        imageUrl={item.image_url}
                                    />
                                )
                            }
                        </div>
                        {/* container 3 */}
                        <aside className={styles.summaryWrap}>
                            <div className={styles.summary}>
                                <h3 className={styles.title}>Order Summary</h3>
                                <SummaryRow title="Total Product" value={order.total_product}/>
                                <SummaryRow title="Total Item" value={order.total_item}/>
                                <SummaryRow title="Ongkir" value={formatRupiah(order.ongkir)}/>
                                <div className={styles.line}></div>
                                <div className={styles.total}>
                                    <p>Total :</p>
                                    <p>{ formatRupiah(order.total_price) }</p>
                                </div>
                            </div>
                            <table className={styles.ExpDate}>
                                <thead>
                                    <tr>
                                        <th colSpan="2" className={styles.title} >Expired Date</th>
                                    </tr>
                                    <tr className={styles.headerRow}>
                                        <th className={styles.productName}>Product</th>
                                        <th className={styles.dateCol}>Expired Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        order.orderItem && order.orderItem.map(item => (
                                            item.recaps.map(recap => 
                                                <ExpRow product={item.name} expDate={recap.exp_date} />
                                            )
                                        ))
                                    }
                                </tbody>
                            </table>
                        </aside>
                        {/* container 4 */}
                        <div className={styles.moreInfo}>
                            <Info label="Address" data={order.address} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Payment" data={order.payment} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Receiver" data={order.receiver} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Order Date" data={ order.create_at && order.create_at.slice(0, 10)} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Phone Number" data={order.phone_number} width="100px" fontData="15px" fontLabel="20px"/>
                        </div>
                        <NavButton teks="Back" width="120px" height="30px" path={from} />
                    </main>
                )
            }
            { isError && <ErrorCard message={isError} /> }
        </section>
    )
}