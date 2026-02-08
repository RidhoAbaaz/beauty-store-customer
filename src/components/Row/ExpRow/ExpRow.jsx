import styles from './ExpRow.module.css';

export default function ExpRow({ product, expDate }) {
    return (
        <tr>
            <td>{ product }</td>
            <td className={styles.expDate}>{ expDate }</td>
        </tr>
    )
}