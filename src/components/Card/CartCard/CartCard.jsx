import { useMemo, useState } from 'react';
import styles from './CartCard.module.css';

export default function CartCard({ name, brand, category, image_url, variant, price, totalStock, setter, id }) {
    const [counter, setCounter] = useState(1);
    const [checked, setChecked] = useState(false);

    const subTotal = useMemo(() => {
        const total = price * counter;
        return total;
    }, [counter, price]);

    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

    const handleClick = (value) => {
        setChecked(value);
        if (value) {
            const data = {
                product_id: id,
                name,
                brand,
                variant,
                category,
                image_url,
                price,
                qty: counter,
                sub_total: price * counter
            }
            setter(prev => {
                const exists = prev.find(item => item.product_id === id);
                if (exists) {
                    return prev.map(item => item.product_id === id ? data : item);
                }
                    return [...prev, data];
            });
                } 
        else {
            setter(prev => prev.filter(item => item.product_id !== id));
        }
    }

    const handleIncrease = (isChecked) => {
        const qty = counter + 1;
        setCounter(qty);

        if (isChecked) {
            setter(prev => {
                const exists = prev.find(item => item.product_id === id);
                if (!exists) return prev;
                return prev.map(item => item.product_id === id ? {...item, qty: qty, sub_total: price * qty} : item);
            });
        }
    }

    const handleDecrease = (isChecked) => {
        const qty = counter - 1;
        setCounter(qty);

        if (isChecked) {
            setter(prev => {
                const exists = prev.find(item => item.product_id === id);
                if (!exists) return prev;
                return prev.map(item => item.product_id === id ? {...item, qty: qty, sub_total: price * qty} : item);
            });
        }
    }
    
    return (
        <div className={styles.card}>
            <label className={styles.checkWrap} htmlFor={`cart-${id}`}>    
                <input type="checkbox" name={`cart-${id}`}id={`cart-${id}`} value={checked} onChange={(e) => handleClick(e.target.checked)}/>
            </label>
            <div className={styles.mainContent}> 
                <figure>
                    <img src={image_url} alt="image" />
                </figure>
                <div className={styles.info}>
                    <span className={styles.brand}>{ brand }</span>
                    <h3 className={styles.productName}>{ name }</h3>
                    <p className={styles.variant}>{ variant }</p>
                    <p className={styles.price}>{formatRupiah( price )}</p>
                </div>
                <div className={styles.unit}>
                    <p className={styles.title}>Qty</p>
                    <div className={styles.counter}>
                        <button onClick={() => handleDecrease(checked)} disabled={ counter <= 1 } aria-label='descrease item' ><i className="bi bi-dash-square"></i></button>
                        <p>{ counter }</p>
                        <button onClick={() => handleIncrease(checked)} disabled={counter >= totalStock} aria-label='increase item'><i className="bi bi-plus-square"></i></button>
                    </div>
                    <p className={styles.stock}>Stock: {totalStock}</p>
                </div>
                <div className={styles.subTotal}>
                    <p>Sub Total :</p>
                    <p>{ formatRupiah(subTotal) }</p>
                </div>
            </div>
        </div>
    )
}