import styles from './InfoRow.module.css';

export default function InfoRow({ title, value }) {
    return (
        <div className={styles.row}>
            <p className={styles.product}>{ title }</p>
            <p className={styles.value}>: { value }</p>
        </div>
    )
}