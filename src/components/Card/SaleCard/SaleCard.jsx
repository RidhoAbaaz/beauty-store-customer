import styles from './SaleCard.module.css';

export default function SaleCard({ name, brand, varian, price, discount, imageUrl }) {
    const finalPrice = (price, discount) => {
        const diskon = parseInt(discount);
        const afteDiscount = (diskon/100) * price;
        const total = price - afteDiscount;
        return total;
    }
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    return (
        <div className={styles.cardWrapper} style={{ "--before-content": `"${discount}%"` }}>
            <figure className={styles.imageWrapper}>
                <img src={imageUrl} alt="Image"/>
            </figure>
            <div className={styles.cardBody}>
                <span className={styles.brand}>{brand}</span>
                <h3 className={styles.productName}>{ name }</h3>
                <p className={styles.variant}>{ varian }</p>
                <div className={styles.priceRow}>
                    <p className={styles.before}>{formatRupiah( price )}</p>
                    <p className={styles.price}>{formatRupiah( finalPrice(price, discount) )}</p>
                </div>
            </div>
        </div>
    )
}