import styles from './Filter.module.css';

export default function Filter( { title, name, value, handler, list }) {
    return (
        <div className={styles.filterBlock}>
            <h3 className={styles.filterLabel}>{ title }</h3>
            <select className={styles.filterSelect} name={name} value={value} onChange={(e) => handler(e.target.value, e.target.name)}>
                <option value="">-- Belum dipilih --</option>
                {list.map((item, index) => <option key={index} value={item}>{item}</option> )}
            </select>
        </div>
    )
}