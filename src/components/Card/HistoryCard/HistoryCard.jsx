import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button';
import styles from './HIstoryCard.module.css';
import { useContext } from 'react';
import { BaseUrl } from '../../../context/BaseUrl';
import { RequestHandler } from '../../../helper/RequestHandler';

export default function HistoryCard({ brand, nama, varian, price, qty, imageUrl, setLoading, setErrorMessage, productId }) {
    const subTotal = (price, sum) => price * sum;
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    
    const navigation = useNavigate();

    const baseUrl = useContext(BaseUrl);

    const handleCart = async () => {
        setLoading(true);

        const payload = {
            product_id: productId,
        }
        console.log(`ini dari product id ${productId}`)
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

    return(
        <div className={styles.card}> 
            <figure>
                <img src={imageUrl} alt="image" />
            </figure>
            <div className={styles.info}>
                <span className={styles.brand}>{brand}</span>
                <h3 className={styles.productName}>{ nama }</h3>
                <p className={styles.variant}>{ varian }</p>
                <p className={styles.price}>{formatRupiah( price )}</p>
            </div>
            <p className={styles.qty}>x{ qty }</p>
            <div className={styles.subTotal}>
                <p>Sub Total :</p>
                <p>{ formatRupiah(subTotal(price, qty)) }</p>
            </div>
            <div className={styles.actions}>
                <Button teks="Repeat Order" height="42px" width="100%" handler={handleCart}>
                    <i className="bi bi-bag"></i>
                </Button>
            </div>
        </div>
    )
}