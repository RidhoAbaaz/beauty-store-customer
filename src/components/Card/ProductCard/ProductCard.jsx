import styles from './ProductCard.module.css';

export default function ProductCard({ name, brand, varian, price, image_url }) {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    return (
        <div className={styles.cardWrapper}>
            <figure className={styles.imageWrapper}>
                <img src={image_url} alt="Image"/>
            </figure>
            <div className={styles.cardBody}>
                <span className={styles.brand}>{brand}</span>
                <h3 className={styles.productName}>{ name }</h3>
                <p className={styles.variant}>{ varian }</p>
                <p className={styles.price}>{formatRupiah( price )}</p>
            </div>
        </div>
    )
}