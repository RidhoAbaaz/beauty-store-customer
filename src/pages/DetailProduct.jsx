import { useContext, useEffect, useMemo, useState } from 'react';
import styles from '../assets/styles/DetailProduct.module.css';
import NavButton from '../components/Button/NavButton';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HandlerButton from '../components/Button/HandlerButton';
import Toolbar from '../components/Toolbar/Toolbar';
import NavBar from '../components/Sidebar/NavBar';
import Info from '../components/Info/Info';
import { RequestHandler } from '../helper/RequestHandler';
import { BaseUrl } from '../context/BaseUrl';
import LoadingCard from '../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../components/Card/ErrorCard/ErrorCard';
import Empty from '../components/Empty/Empty';
import SuccessCard from '../components/Card/SuccessCard/SuccessCard';

export default function DetailPage() {
    const [product, setProduct] = useState({});
    const [duplicate, setDuplicate] = useState({
        isInFavorite: false,
        isInCart: false,
    });

    const [counter, setCounter] = useState(0);

    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [refresh, setRefresh] = useState({
        favorite: false,
        cart: false,
    });

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

    const finalPrice = (total, diskon) => {
        const discountValue = parseInt(diskon)
        const discountPrice = (discountValue/100) * total;
        const final = total - discountPrice
        return final;
    }

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/products/${id}`);
                setProduct(response.product);
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [baseUrl, id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RequestHandler(`${baseUrl}/favorite/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDuplicate(prev => ({
                    ...prev,
                    isInFavorite: response.inFavorite
                }))
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            }
        }
        fetchData();
    }, [refresh.favorite, baseUrl, id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RequestHandler(`${baseUrl}/cart/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDuplicate(prev => ({
                    ...prev,
                    isInCart: response.inCart
                }))
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            }
        }
        fetchData();
    }, [baseUrl, id, refresh.cart]);
    

    const price = useMemo(() => {
        const priceValue = product.price || 0;
        const discount = product.discount || 0;
        const subTotal = priceValue * counter;

        return {
            sub_total: subTotal,
            final_price: finalPrice(subTotal, discount)
        };
    }, [counter, product.price, product.discount]);


    const location = useLocation();
    const navigation = useNavigate();
    const from = location.state?.from || "/";

    const handleFavorite = async () => {
        setLoading(true);

        const payload = {
            product_id: product.product_id,
            name: product.name,
            category: product.category,
            brand: product.brand,
            variant: product.variant,
            price: product.price,
            image_url: product.image_url
        }


        if (duplicate.isInFavorite  === false) {
            try {
                await RequestHandler(`${baseUrl}/favorite`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                });
                setRefresh(prev => ({
                    ...prev,
                    favorite: !prev.favorite
                }))
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
        } else {
            try {
                await RequestHandler(`${baseUrl}/favorite/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
                setRefresh(prev => ({
                    ...prev,
                    favorite: !prev.favorite
                }))
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleCart = async () => {
        setLoading(true);
        const payload = {
            product_id: product.product_id,
        }
        try {
            await RequestHandler(`${baseUrl}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            navigation('/Cart')
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

    const handleCheckout = async () => {
        setLoading(true);

        if (counter === 0) {
            setErrorMessage("Jumlah produk harus lebih dari 0");
            setTimeout(() => setErrorMessage(""), 3000)
            setLoading(false)
            return;
        }

        
        const payload = {
            product_id: product.product_id,
            name: product.name,
            category: product.category,
            brand: product.brand,
            variant: product.variant,
            price: product.price,
            image_url: product.image_url,
            sub_total: price.final_price,
            qty: counter
        }

        try {
            const response = await RequestHandler(`${baseUrl}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

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
            setLoading(false)
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setSuccessMessage("Link has Been Copy");
        setTimeout(() => setSuccessMessage(""), 3000);
    }

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar trigger={ duplicate } />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    Object.keys(product).length !== 0 ? (
                        <main className={styles.container}>
                            <figure>
                                <img src={product.image_url} alt="image" />
                            </figure>
                            <div className={styles.infoWrapper}>
                                <Info label="Product Name" data={product.name} width="250px" fontLabel="16px" fontData="15px"/>
                                <Info label="Stock" data={product.total_stock} width="250px" fontLabel="16px" fontData="15px"/>
                                <Info label="Product Category" data={product.category} width="250px" fontLabel="16px" fontData="15px"/>
                                <Info label="Brand" data={product.brand} width="250px" fontLabel="16px" fontData="15px"/>
                                <Info label="Variant" data={product.variant} width="250px" fontLabel="16px" fontData="15px"/>
                                <Info label="Price" data={formatRupiah(product.price)} width="250px" fontLabel="16px" fontData="15px"/>
                            </div>
                            <div className={styles.selection}>
                                <div className={styles.unit}>
                                    <p className={styles.title}>Unit :</p>
                                    <div className={styles.counter}>
                                        <button onClick={() => setCounter(prev => prev - 1)} disabled={ counter === 0 }><i className="bi bi-dash-square"></i></button>
                                        <p>{ counter }</p>
                                        <button onClick={() => setCounter(prev => prev + 1)}  disabled={ counter >= product.total_stock }><i className="bi bi-plus-square"></i></button>
                                    </div>
                                </div>
                                <Info label="Sub Total" data={formatRupiah(price.sub_total)} fontLabel="15px" fontData="13px" />
                                <Info label="Diskon" data={`${product.discount}%`} fontLabel="15px" fontData="13px" />
                                <div className={styles.totalPrice}>
                                    <Info label="Final Price" data={ counter != 0 ? formatRupiah(price.final_price) : "0"} fontLabel="15px" fontData="13px" />
                                </div>
                            </div>
                            <div className={styles.description}>
                                <h4>Deskripsi</h4>
                                <p>{ product.description }</p>
                            </div>
                            <div className={styles.btnWrapper}>
                                <HandlerButton value={ duplicate.isInFavorite === true ? "Already In Favorite" : "Likes"} handler={handleFavorite}>
                                    {
                                        duplicate.isInFavorite === true ? <i className={`bi bi-heart-fill ${styles.icon}`}></i> : <i className="bi bi-heart"></i>
                                    }
                                </HandlerButton>
                                <HandlerButton value="Share" handler={handleCopyLink}>
                                    <i className="bi bi-share"></i>
                                </HandlerButton>
                                <HandlerButton value="Checkout" handler={handleCheckout}>
                                    <i className="bi bi-bag-check"></i>
                                </HandlerButton>
                                <HandlerButton value={ duplicate.isInCart === true ? "Already In Cart" : "Add To Cart" } handler={handleCart} isDisable={duplicate.isInCart}>
                                    <i className="bi bi-cart"></i>
                                </HandlerButton>
                                <NavButton teks="Back" width="100%" height="50px" path={from} />
                            </div>
                        </main>
                    ) : <Empty />
                )
            }
            { errorMessage && <ErrorCard message={errorMessage} /> }
            { successMessage && <SuccessCard message={successMessage} /> }
        </section>
    )
}