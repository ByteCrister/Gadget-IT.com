import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/HomePageStyles/UserFeaturedIcons.module.css';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';

const UserFeaturedIcons = () => {
    const { dataState } = useContext(useData);

    return (
        <section>
            {
                dataState.UserHomeContents?.featured_icon?.length > 0 && (
                    <div className={styles.featuredHead}>
                        <h1>FEATURED CATEGORIES</h1>
                        <h3>Get your desired product from featured category</h3>
                    </div>
                )
            }
            <section className={styles.featuredIconContainer}>
                {
                    dataState.UserHomeContents?.featured_icon?.length > 0 &&
                    dataState.UserHomeContents.featured_icon.map((item) => (
                        <Link key={item.icon_no} to={`/products/${item.main_category}`}>
                            <div>
                                <img src={item.icon} alt={`featured-img-${item.icon_no}`}></img>
                            </div>
                            <span>{GetCategoryName(item.main_category)}</span>
                        </Link>
                    ))
                }
            </section>
        </section>
    );
};

export default UserFeaturedIcons;
