import React from 'react';
import styles from '../styles/AdminHome/CreateNewTable.module.css';

const CategoryRadioGroup = ({ category, AllMainCategory, onChange, name }) => (
    <div className={styles.RadioOptionMain}>
        {category.map((items, index) => (
            <div className={styles.MainCategorySelectRadio} key={index}>
                <p className={styles.parentName}>Parent : {AllMainCategory[index]}</p>
                <div className={styles.CategoryRadio}>
                    <input
                        type="radio"
                        id={`${name}-${index}`}
                        name={name}
                        value={items}
                        onChange={(e) => onChange(e.target.value, AllMainCategory[index])}
                    />
                    <label className="radioLabel" htmlFor={`${name}-${index}`}>{items}</label>
                </div>
            </div>
        ))}
    </div>
);

export default CategoryRadioGroup;
