import styles from './OrderItem.module.css';

export default function OrderItem({ brand, nama, varian, price, total, qty, imageUrl }) {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    return (
        <div className={styles.itemCard}>
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
                <p>{ formatRupiah(total) }</p>
            </div>
        </div>
    )
}