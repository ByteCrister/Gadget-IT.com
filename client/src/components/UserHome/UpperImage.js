import React, { useRef, useState } from "react";
import styles from "../../styles/HomePageStyles/ViewProduct.module.css";

const UpperImage = ({ viewProduct, product_id }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 });
    const mainImageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!mainImageRef.current) return;
        const rect = mainImageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log("X : " + x + " Y : " + y + "  clientX : " + e.clientX + "  clientY : " + e.clientY + "   left : " + rect.left + "   top : " + rect.top);
        setMagnifyPosition({ x, y });
    };

    return (
        <div className={styles.upper_image}>
            <div
                className={styles.upper_main_image}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                ref={mainImageRef}
            >
                {viewProduct.images.length > 0 && (
                    <>
                        <img
                            src={viewProduct.images[currentImage]}
                            alt={`product-id-${product_id}`}
                            id="main-image"
                            className={styles.main_image}
                        />
                        {isImageHovered && (
                            <div
                                className={styles.magnifier}
                                style={{
                                    top: `${magnifyPosition.y}px`,
                                    left: `${magnifyPosition.x}px`,
                                    backgroundImage: `url(${viewProduct.images[currentImage]})`,
                                    backgroundSize: `${mainImageRef.current?.clientWidth * 2}px ${mainImageRef.current?.clientHeight * 2
                                        }px`,
                                    backgroundPosition: `-${magnifyPosition.x * 2}px -${magnifyPosition.y * 2
                                        }px`,
                                }}
                            />
                        )}
                    </>
                )}
            </div>
            <div className={styles.main_extra_images}>
                {viewProduct.images.map((item, index) => (
                    <div
                        key={index}
                        className={currentImage === index ? styles.img_border : styles.main_extra_images_border}
                    >
                        {item && (
                            <img
                                src={item}
                                alt={`sub-image-${index}`}
                                onClick={() => setCurrentImage(index)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpperImage;
