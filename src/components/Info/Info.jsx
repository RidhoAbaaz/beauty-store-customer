import styles from './Info.module.css';

export default function Info({ label, data, width, fontLabel, fontData }) {
    return (
        <div className={styles.wrapper} style={{ minWidth: width }}>
            <h5 className={styles.label} style={{ fontSize: fontLabel }}>{ label }</h5>
            <p className={styles.data} style={{ fontSize: fontData }}>{ data }</p>
        </div> 
    )
}