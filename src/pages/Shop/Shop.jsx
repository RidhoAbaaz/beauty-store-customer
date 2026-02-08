import { useContext, useEffect, useState } from 'react';
import styles from '../../assets/styles/Shop/Shop.module.css';
import Button from '../../components/Button/Button';
import ProductCard from '../../components/Card/ProductCard/ProductCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../components/Sidebar/NavBar';
import Toolbar from '../../components/Toolbar/Toolbar';
import Filter from '../../components/Filter/Filter';
import { BaseUrl } from '../../context/BaseUrl';
import { RequestHandler } from '../../helper/RequestHandler';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import Empty from '../../components/Empty/Empty';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';
import SaleCard from '../../components/Card/SaleCard/SaleCard';

export default function Shop() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const baseUrl = useContext(BaseUrl);

    const useGetQuery = () => {
        const { search } = useLocation();
        return Object.fromEntries(new URLSearchParams(search).entries());
    }
    const { category = "", brand = "", varian = "" } = useGetQuery();

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/products`);
                setProducts(response.products)
            } catch (error) {
                setErrorMessage(error.message);
                setTimeout(() => setErrorMessage(""), 3000)
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [baseUrl]);


    const handleChange = (e) => setSearch(e.target.value);

    const changeDropdown = (value, name) => {
        const newParams = new URLSearchParams(location.search);
        if (name === "tipe") {
            const data = value === undefined ? "" : value; 
            newParams.set('category', data);
            newParams.delete('brand');
            newParams.delete('varian');
        }
        else if (name === "merk") {
            newParams.set('brand', value);
            newParams.delete('varian');
        }
        else {
            newParams.set('varian', value);
        }
        navigate(`/Shop?${newParams.toString()}`)
    };

    const resetFilter = () => {
        navigate("/Shop");
    }

    const input = search.toLowerCase().trim();
    const filteredProduct = products.filter(item => { 
        return (
            (category ? item.category === category : true) &&
            (brand ? item.brand === brand : true) &&
            (varian? item.variant === varian: true) &&
            (input ? item.name.toLowerCase().includes(input.toLowerCase()) : true)
        );
    });

    const listCategory = [...new Set(products.map(item => item.category))];
    const listBrand = [...new Set(products.filter(item => item.category === category).map(item => item.brand))]
    const listVarian = [...new Set(products.filter(item => item.category === category && item.brand === brand).map(item => item.variant))]

    return (
        <section className={styles.mainLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    products.length !== 0 ? (
                        <main className={styles.container}>
                            <div className={styles.pageInfo}>
                                <h2 className={styles.pageTitle}>Temukan Produk Favoritmu</h2 >
                                <p className={styles.pageDesc}>
                                    Gunakan pencarian dan filter untuk menemukan skincare & makeup yang sesuai.
                                </p>
                            </div>
                            <div className={styles.filterContainer}>
                                <div className={styles.searchRow}>
                                    <label className={styles.searchLabel} htmlFor="searchInput">
                                        Search
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            id="searchInput"
                                            className={styles.searchInput}
                                            type="text"
                                            placeholder="Cari Produk"
                                            value={search}
                                            onChange={handleChange}
                                        />
                                        {search === "" ? null : <i className="bi bi-x-circle" onClick={() => setSearch("")} style={{ cursor: "pointer" }}></i>}    
                                    </div>
                                </div>
                                <div className={styles.filterWrapper}>
                                    <Filter value={category} list={listCategory} handler={changeDropdown} name="tipe" title="Kategori" />
                                    <Filter value={brand} list={listBrand} handler={changeDropdown} name="merk" title="Brand"/>
                                    <Filter value={varian} list={listVarian} handler={changeDropdown} name="varian" title="Varian"/>
                                    <div className={styles.button}>
                                        <Button teks="Reset" handler={resetFilter} width="100px" height="30px">
                                            <i className="bi bi-arrow-repeat"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.productWrapper}>
                                {
                                    filteredProduct.map(item => (
                                        <Link key={item.prduct_id} to={`/product/${item.product_id}`} state={{ from: location.pathname + location.search }} style={{ textDecoration: "none", color: "black" }}>
                                            {
                                                item.discount ? 
                                                <SaleCard 
                                                    name={item.name} 
                                                    brand={item.brand} 
                                                    price={item.price} 
                                                    varian={item.variant}
                                                    discount={item.discount}
                                                    imageUrl={item.image_url} 
                                                /> : 
                                                <ProductCard 
                                                    name={item.name} 
                                                    brand={item.brand} 
                                                    price={item.price} 
                                                    varian={item.variant}
                                                    image_url={item.image_url} 
                                                />
                                            }
                                        </Link>
                                    ))
                                }
                            </div>
                        </main>
                    ) : <Empty />
                )
            }
            { errorMessage && <ErrorCard message={errorMessage} /> }
        </section>
    )
}