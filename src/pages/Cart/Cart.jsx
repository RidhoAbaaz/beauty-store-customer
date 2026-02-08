import { useContext, useEffect, useMemo, useState } from 'react';
import styles from '../../assets/styles/Cart/Cart.module.css';
import Button from '../../components/Button/Button';
import NavButton from '../../components/Button/NavButton';
import CartCard from '../../components/Card/CartCard/CartCard';
import SummaryRow from '../../components/Row/Summary/SummaryRow';
import Toolbar from '../../components/Toolbar/Toolbar';
import NavBar from '../../components/Sidebar/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../context/BaseUrl';
import { RequestHandler } from '../../helper/RequestHandler';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';
import SuccessCard from '../../components/Card/SuccessCard/SuccessCard';

export default function Cart() {
    const [product, setProduct] = useState([]);
    const [productId, setProductId] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [refresh, setRefresh] = useState(false);

    const navigation = useNavigate();

    const baseUrl = useContext(BaseUrl);

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        maximumFractionDigits: 0 }).format(n || 0);

    const totalPrice = useMemo(() => {
        const total = selectedProduct.reduce((acc, item) => acc + item.sub_total, 0 );
        return total;
    }, [selectedProduct])

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProductId(response.carts);
            } catch (error) {
                if (error.message === "token not found") {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                        navigation('/login')
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
    }, [baseUrl, navigation, refresh]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (productId.length === 0) {
                    setProduct([]);
                }

                const request = productId.map(item => 
                    RequestHandler(`${baseUrl}/products/${item.product_id}`)
                );

                const response = await Promise.all(request);
                const products = response.map(data => data.product);

                setProduct(products)
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [baseUrl, productId])

    const handleCheckout = async () => {
        setLoading(true);
        
        try {
            if (selectedProduct.length === 0) {
                throw new Error("silahkan pilih product yang ingin dibeli")
            }
            const response = await RequestHandler(`${baseUrl}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedProduct)
            });

            setSelectedProduct([]);
            navigation('/Checkout', {
                state: {
                    productRecap: response.productRecap,
                    from: location.pathname
                }
            })
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

    const handleDelete = async () => {
        setLoading(true);

        const payload = selectedProduct.map(item => item.product_id);
        try {
            if (selectedProduct.length === 0) {
                throw new Error("silahkan pilih product yang ingin Dihapus")
            }
            const response = await RequestHandler(`${baseUrl}/cart`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            setSuccessMessage(response.message);
            setRefresh(prev => !prev);
            setSelectedProduct([]);
            setTimeout(() => {
                setSuccessMessage("")
            }, 3000);
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
                    <Toolbar trigger={refresh} />
                    <NavBar />
                </header>
                {
                    loading ? <LoadingCard /> : (
                        product.length === 0 ? (
                            <main className={styles.emptyCart}>
                                <p>Belum ada product di keranjang, yuk buruan tambah produknya</p>
                                <NavButton teks="Add Now" height="30px" width="100px" path="/Shop">
                                    <i className="bi bi-plus-circle"></i>
                                </NavButton>
                            </main>
                        ) : (
                            <main className={styles.container}>
                                <h2 className={styles.pageTitle}>Simpan Product yang ingin kamu beli di keranjang</h2>
                                <div className={styles.toolbar}>
                                    <p className={styles.resultInfo}>{ product.length } Product in Cart</p>
                                    <div className={styles.buttonWrap}>
                                        <NavButton teks="Add More" height="40px" width="100px" path="/Shop">
                                            <i className="bi bi-cart-plus"></i>
                                        </NavButton>
                                        <Button teks="Delete" height="40px" width="100px" handler={handleDelete}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </div>
                                <div className={styles.cardWrap}>
                                    {
                                        product.map(
                                            item => 
                                            <CartCard 
                                                key={item.product_id} 
                                                name={item.name} 
                                                brand={item.brand} 
                                                price={item.price} 
                                                variant={item.variant}
                                                category={item.category}
                                                image_url={item.image_url}
                                                totalStock={item.total_stock} 
                                                setter={setSelectedProduct}
                                                id={item.product_id}
                                            />
                                        )
                                    }
                                </div>
                                <div className={styles.summaryWrap}>
                                    <div className={styles.summary}>
                                        <h3 className={styles.title}>Summary</h3>
                                        {
                                            selectedProduct.length === 0 
                                                ? <p className={styles.empty}>Data Kosong <br />Silahkan Pilih Product Terlebih Dahulu</p> 
                                                : selectedProduct.map(item => <SummaryRow key={item.product_id} title={item.name} value={item.qty}/>)
                                        }
                                        <div className={styles.line}></div>
                                        <div className={styles.total}>
                                            <p>Total :</p>
                                            <p>{ formatRupiah(totalPrice) }</p>
                                        </div>
                                    </div>
                                    <button className={styles.checkoutBtn} onClick={handleCheckout}>
                                        <p>Checkout</p>
                                        <i className="bi bi-bag-check"></i>
                                    </button>
                                </div>
                            </main>
                        )
                    )
                }
                { errorMessage && <ErrorCard message={errorMessage} /> }
                { successMessage && <SuccessCard message={successMessage} /> }
        </section>
    )
}