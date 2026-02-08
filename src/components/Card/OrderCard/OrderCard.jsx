import styles from './OrderCard.module.css';

export default function OrderCard({ orderID, status, date, totalProduct, totalItem, price, payment }) {
    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    const statusKey = (status || "").toLowerCase();

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.headerId}>
                    <p className={styles.label}>Order ID</p>
                    <h4 className={styles.orderId}>{orderID}</h4>
                </div>
                <span className={`${styles.statusBadge} ${styles[`badge_${statusKey}`] || ""}`}>
                    {status}
                </span>
            </header>
            <div className={styles.orderInfo}>
                <div className={styles.infoItem}>
                    <h5 className={styles.infoLabel}> Order Date </h5>
                    <p className={styles.infoValue}> { date } </p>
                </div>
                <div className={styles.infoItem}>
                    <h5 className={styles.infoLabel}>Payment</h5>
                    <p className={styles.infoValue}>{payment}</p>
                </div>
            </div>
            <div className={styles.stats}>
                <div className={styles.statsCard}>
                    <p className={styles.statsLabel}>Total Product</p>
                    <p className={styles.statsValue}>{ totalProduct }</p>
                </div>
                <div className={styles.statsCard}>
                    <p className={styles.statsLabel}>Total Item</p>
                    <p className={styles.statsValue}>{ totalItem }</p>
                </div>
            </div>
            <footer className={styles.footer}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatRupiah(price)}</span>
            </footer>
        </article>
    )
}