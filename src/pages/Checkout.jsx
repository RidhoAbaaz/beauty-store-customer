import { useContext, useEffect, useMemo, useState } from 'react';
import styles from '../assets/styles/Checkout.module.css';
import OrderItem from '../components/Card/OrderItem/OrderItem';
import Checkbox from '../components/Checkbox/Checkbox';
import { useLocation, useNavigate } from 'react-router-dom';
import NavButton from '../components/Button/NavButton';
import SummaryRow from '../components/Row/Summary/SummaryRow';
import ExpRow from '../components/Row/ExpRow/ExpRow';
import Toolbar from '../components/Toolbar/Toolbar';
import NavBar from '../components/Sidebar/NavBar';
import Filter from '../components/Filter/Filter';
import InfoRow from '../components/Row/infoRow/InfoRow';
import { RequestHandler } from '../helper/RequestHandler';
import { BaseUrl } from '../context/BaseUrl';
import LoadingCard from '../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../components/Card/ErrorCard/ErrorCard';
import SuccessCard from '../components/Card/SuccessCard/SuccessCard';
import HandlerButton from '../components/Button/HandlerButton';

export default function Checkout() {
    const [isChecked, setIsChecked] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [eWalletValue, setEWalletValue] = useState("");
    const [address, setAddress] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { state } = useLocation();
    const navigation = useNavigate();
    const baseUrl = useContext(BaseUrl);

    const ongkir = 20000;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RequestHandler(`${baseUrl}/address`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAddress(response);
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } 
        }
        fetchData();
    }, [baseUrl])

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

    const totalProduct = state.productRecap.length;

    const totalItem = useMemo(() => {
        const sumQty =  state.productRecap.reduce((acc, item) => acc + item.qty, 0);
        return sumQty;
    }, [state.productRecap])

    const totalPrice = useMemo(() => {
        const sumSubtotal = state.productRecap.reduce((acc, item) => acc + item.sub_total, 0);
        return sumSubtotal + ongkir;
    }, [state.productRecap])

    const listReceiver = address ? address.map(item => item.receiver) : [];
    const receiverInformation = address.find(item => item.receiver === filterValue);

    const handleCheckout = async () => {
        setLoading(true);
        if (!isChecked) {
            setLoading(false);
            setErrorMessage("select payment method");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        if (isChecked === "E-Wallet" && !eWalletValue) {
            setLoading(false);
            setErrorMessage("select E-Wallet Type");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        if (!receiverInformation) {
            setLoading(false);
            setErrorMessage("select receiver");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        const payload = {
            products : state.productRecap,
            total_item: totalItem,
            total_product: totalProduct,
            receiver: receiverInformation.receiver,
            address: receiverInformation.address,
            phone_number: receiverInformation.phone_number,
            total_price: totalPrice,
            ongkir,
            payment: isChecked === "E-Wallet" ? `${isChecked}(${eWalletValue})` : isChecked,
        }

        const from = state.from.split('/')[1];
        
        try {
            const response = await RequestHandler(`${baseUrl}/getOrder/${from}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            })
            setSuccessMessage(response.message);
            setTimeout(() => {
                setSuccessMessage("");
                navigation("/Order");
            }, 3000)
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            <main className={styles.container}>
                {/* container 1 */}
                <div className={styles.wrapper}>
                    <div className={styles.itemWrap}>
                        {
                            state.productRecap.map(item => 
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
                    {/* container 2 */}
                    <aside className={styles.summaryWrap}>
                        <div className={styles.summary}>
                            <h3 className={styles.title}>Order Summary</h3>
                            <SummaryRow title="Total Product" value={totalProduct}/>
                            <SummaryRow title="Total Item" value={totalItem}/>
                            <SummaryRow title="Ongkir" value={formatRupiah(ongkir)}/>
                            <div className={styles.line}></div>
                            <div className={styles.total}>
                                <p>Total :</p>
                                <p>{ formatRupiah(totalPrice) }</p>
                            </div>
                        </div>
                        <table className={styles.ExpDate}>
                            <thead>
                                <tr>
                                    <th colSpan="2" className={styles.title} >Expired Date</th>
                                </tr>
                                <tr className={styles.headerRow}>
                                    <th className={styles.productName}>Product</th>
                                    <th className={styles.date}>Expired Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    state.productRecap.map(product => 
                                        product.batchRecap.map(item => 
                                            <ExpRow key={item.bacth_code} product={product.name} expDate={item.exp_date} />
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </aside>
                </div>
                {/* container 3 */}
                <div className={styles.payment}>
                    <h5>Payment Method</h5>
                    <div className={styles.options}>
                        <Checkbox value="COD" setter={setIsChecked} name="COD" isChecked={isChecked} />
                        <Checkbox value="Transfer" setter={setIsChecked} name="Transfer" isChecked={isChecked} />
                        <Checkbox value="E-Wallet" setter={setIsChecked} name="E-Wallet" isChecked={isChecked} />
                    </div>
                    {
                        isChecked === "Transfer" && (
                            <div className={styles.methodBox}>
                                <div className={styles.methodHeader}>
                                    <p className={styles.methodTitle}>Transfer Bank</p>
                                    <span className={styles.methodBadge}>Rekening</span>
                                </div>
                                <div className={styles.transferRow}>
                                    <span className={styles.label}>No Rekening</span>
                                    <span className={styles.value}>11334455667788</span>
                                </div>
                            </div>
                        )
                    }
                    {
                        isChecked === "E-Wallet" && (
                            <div className={styles.methodBox}>
                                <div className={styles.methodHeader}>
                                    <p className={styles.methodTitle}>E-Wallet</p>
                                    <span className={styles.methodBadge}>Instan</span>
                                </div>
                                <div className={styles.walletGrid}>
                                    <div className={`${styles.walletItem} ${eWalletValue === "Dana" && styles.active}`}  onClick={() => setEWalletValue("Dana")}>
                                        <span className={styles.walletName}>Dana</span>
                                        <span className={styles.walletNumber}>08673646574</span>
                                    </div>
                                    <div className={`${styles.walletItem} ${eWalletValue === "GoPay" && styles.active}`}  onClick={() => setEWalletValue("GoPay")}>
                                        <span className={styles.walletName}>GoPay</span>
                                        <span className={styles.walletNumber}>08122336644</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                {/* container 4 */}
                <div className={styles.address}>
                    <h5>Receiver Information</h5>
                    {
                        listReceiver.length !== 0 ? (
                            <>
                                <Filter title="Receiver Name" value={filterValue} list={listReceiver} handler={setFilterValue} name="receiver"/>
                                {
                                    receiverInformation ? (
                                        <div className={styles.receiverInfo}>
                                            <InfoRow title= "Receiver Name" value={receiverInformation.receiver} />
                                            <InfoRow title= "Phone Number" value={receiverInformation.phone_number} />
                                            <InfoRow title= "Address" value={receiverInformation.address} />
                                        </div>
                                    ) : null
                                }
                            </>
                        ) : (
                            <div className={styles.emptyAddress}>
                                <p>Silahkan Tambah Alamat Terlebih Dahulu</p>
                                <NavButton teks="Add Address" height="20px" width="100px" path="/profile" />
                            </div>
                        )
                    }
                </div>
                {/* container 5 */}
                <div className={styles.buttonWrap}>
                    <button className={styles.checkoutBtn} onClick={handleCheckout}>
                        <p>Order</p>
                        <i className="bi bi-bookmark-plus"></i>
                    </button>
                    <NavButton teks="Kembali" height="50px" width="100px" path={state.from} />
                </div>
            </main>
            { loading && <LoadingCard /> }
            { errorMessage && <ErrorCard message={errorMessage} /> }
            { successMessage && <SuccessCard message={successMessage} /> }
        </section>
    )
}