import styles from './AddressRow.module.css';

export default function AddressRow({ reveiver, address, handler, phoneNumber }) {
    return (
        <div className={styles.card}>
            <h3>{ reveiver }</h3>
            <div className={styles.actionWrap}>
                <i className={`bi bi-pencil ${styles.actionBtn}`} onClick={() => handler("update")}></i>
                <i className={`bi bi-trash ${styles.actionBtn}`} onClick={() => handler("delete")}></i>
            </div>
            <p className={styles.number}> { phoneNumber } </p>
            <p>{ address }</p>
        </div>
    )
}