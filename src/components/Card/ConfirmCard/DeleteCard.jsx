import style from "./DeleteCard.module.css";

export default function DeleteCard({
        message,
        confirmText = "Ya",
        cancelText = "Batal",
        onConfirm,
        onCancel,
    }) {
    return (
        <div className={style.overlay}>
            <div className={style.card}>
                <p className={style.message}>{message}</p>
                <div className={style.actions}>
                    <button className={style.btnCancel} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={style.btnConfirm} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
