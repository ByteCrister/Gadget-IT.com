import React, { useContext } from "react";
import { useData } from "../context/useData";
import styles from '../styles/HomePageStyles/CategoryChildContainer.module.css';
import { Link } from "react-router-dom";
import { GetCategoryName } from '../HOOKS/GetCategoryName';

export const getCategoryChild = (categoryName, Subcategory) => {
    const children = Subcategory.filter(item => item.main_category_name === categoryName);

    const childNames = children.reduce((acc, item) => {
        const subChildren = Subcategory.filter(sub_item => sub_item.main_category_name === item.sub_category_name);

        if (subChildren.length === 0) {
            acc.push(item.sub_category_name);
        }

        return acc;
    }, []);

    return childNames.length > 0 ? childNames : [categoryName];
};

const CategoryChildContainer = ({ category }) => {
    const { dataState } = useContext(useData);

    const categoryChildren = getCategoryChild(category, dataState.productStorage.subCategory);

    return (
        <>
            {categoryChildren.map((item, index) => (
                <Link to={`/products/${category}/${item}`} className={styles.categoryChildren}>
                    <div key={index}>{GetCategoryName(item)}</div>
                </Link>
            ))}
        </>
    );

};

export default CategoryChildContainer;
