import styles from '../../assets/styles/Home/Home.module.css'
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../../components/Sidebar/NavBar";
import NavButton from "../../components/Button/NavButton";
import ProductCard from '../../components/Card/ProductCard/ProductCard';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import SaleCard from '../../components/Card/SaleCard/SaleCard';
import Toolbar from '../../components/Toolbar/Toolbar';
import { BaseUrl } from '../../context/BaseUrl';
import { RequestHandler } from '../../helper/RequestHandler';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';
import Empty from '../../components/Empty/Empty';

export default function Home() {
    const [content, setContent] = useState({
        products: [],
        discountProducts: [],
        banners: [],
        status: "fail"
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/home`);
                setContent({
                    products: response.products,
                    discountProducts: response.discountProducts,
                    banners: response.banners,
                    status: response.status
                });
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [baseUrl]);

    const location = useLocation();

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                content.status !== "fail" ? (
                    <main className={styles.container}>
                        <article className={styles.imageSlider}>
                            <ImageSlider images={content.banners}/>
                        </article>
                        {
                            content.discountProducts.length != 0 && (
                                <article className={styles.productContainer}>
                                    <h4>Discount Product</h4>
                                    <div className={styles.productWrap}>
                                        { content.discountProducts.map(item => (
                                            <Link key={item.product_id} to={`/product/${item.product_id}`} state={{ from: location.pathname + location.search }} style={{ textDecoration: "none", color: "black" }}>
                                                <SaleCard name={item.name} brand={item.brand} price={item.price} varian={item.variant} discount={item.discount} imageUrl={item.image_url}/>
                                            </Link>
                                            )
                                        )}
                                    </div>
                                    <NavButton teks="Shop Now" width="150px" height="50px" path="/Shop">
                                        <i className="bi bi-shop"></i>
                                    </NavButton>
                                </article>
                            )
                        }
                        {
                            content.products.length !== 0 && (
                                <article className={styles.productContainer}>
                                    <h4>Available Product</h4>
                                    <div className={styles.productWrap}>
                                        { content.products.map(item => (
                                            <Link key={item.product_id} to={`/product/${item.product_id}`} state={{ from: location.pathname + location.search }} style={{ textDecoration: "none", color: "black" }}>
                                                <ProductCard name={item.name} brand={item.brand} price={item.price} varian={item.variant} image_url={item.image_url} />
                                            </Link>
                                            )
                                        )}
                                    </div>
                                    <NavButton teks="Shop Now" width="150px" height="50px" path="/Shop">
                                        <i className="bi bi-shop"></i>
                                    </NavButton>
                                </article>
                            )
                        }
                    </main>
                ) : <Empty />
            }
            { loading && <LoadingCard /> }
            { errorMessage && <ErrorCard message={errorMessage} /> }
        </section>
    )
}