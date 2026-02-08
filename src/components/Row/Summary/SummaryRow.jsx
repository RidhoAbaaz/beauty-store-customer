import styles from './SummaryRow.module.css';

export default function SummaryRow({ title, value }) {
    return (
        <div className={styles.row}>
            <p className={styles.product}>{ title }</p>
            <p className={styles.value}>x{ value }</p>
        </div>
    )
}