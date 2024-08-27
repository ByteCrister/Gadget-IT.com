import React from 'react'
import styles from '../styles/HomePageStyles/ParentDescendant.module.css';
import { IoHomeSharp } from 'react-icons/io5';
import { GetCategoryName } from './GetCategoryName';
import { MakeDefendants } from './MakeDefendants';

const ParentDescendant = ({ segments, category, subCategory }) => {
    return (
        <section className={styles.categoryDescendant}>
            <div>
                <IoHomeSharp className={styles.home_icon} />
                {segments.length === 2 ? (
                    ' /' + GetCategoryName(category)
                ) : (
                    (() => {
                        console.log('Calling MakeDefendants');
                        console.log('Category:', category);
                        console.log('SubCategory:', subCategory);
                        return MakeDefendants(category, subCategory);
                    })()
                )}
            </div>
        </section>
    )
}

export default ParentDescendant