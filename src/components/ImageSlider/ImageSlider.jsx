import { useEffect, useState } from "react";
import styles from "./ImageSlider.module.css";

export default function ImageSlider({ images= [] }) {
    const [index, setIndex] = useState(0);
    images.length === 0 && null;

    const next = () => {
        setIndex((prev) => (prev + 1) % images.length)
    }
    const prev = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    useEffect(() => {
        if (images.length <= 0) return;
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(id);
    }, [images.length]);

    return (
        <div className={styles.slider}>
            <div className={styles.sliderTrack} style={{ transform: `translateX(-${index * 100}%)` }}>
                {
                    images.map((images, index) => (
                        <div className={styles.slide} key={images + index}>
                                <img className={styles.image} src={images.banner_url} alt={`slide-${index + 1}`} />
                        </div>
                    ))
                }
            </div>
            {
                images.length > 1 && (
                    <div>
                        <button className={`${styles.arrow} ${styles.left}`} onClick={prev} type="button">
                        ‹
                        </button>
                        <button className={`${styles.arrow} ${styles.right}`} onClick={next} type="button">
                        ›
                        </button>
                    </div>

                )
            }
            {
                images.length > 1 && (
                    <div className={styles.dots}>
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.dot} ${i === index ? styles.active : ""}`}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )
            }
        </div>
    )
}
