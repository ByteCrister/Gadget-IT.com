import React, { useContext } from "react";
import { useData } from "../../context/useData";
import ProductCart from "../../HOOKS/ProductCart";
import styles from "../../styles/HomePageStyles/FeaturedProducts.module.css";
import SkeletonLoader from "../ui/SkeletonLoader";

const FeaturedProducts = () => {
    const { dataState } = useContext(useData);
    const userHomeProducts =
        dataState?.UserHomeContents?.user_home_products || [];

    if (!dataState?.UserHomeContents?.user_home_products || dataState?.UserHomeContents) return <SkeletonLoader />

    return (
        userHomeProducts.length > 0 &&
        userHomeProducts && (
            <section className={styles.mainFeaturedContainer}>
                <section>
                    <span>Featured Products</span>
                    <div></div>
                </section>
                <div>
                    {userHomeProducts.length > 0 &&
                        userHomeProducts
                            .filter((item) => item.position === "featured_products")
                            .map((item, i) => <ProductCart product={item} key={i} />)}
                </div>
            </section>
        )
    );
};

export default FeaturedProducts;
