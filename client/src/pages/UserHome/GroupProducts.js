import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../../styles/HomePageStyles/GroupProducts.module.css';
import CategoryChildContainer from '../../HOOKS/CategoryChildContainer';
import ParentDescendant from '../../HOOKS/ParentDescendant';
import { GetMainTable } from '../../HOOKS/GetMainTable';
import { useData } from '../../context/useData';
import MainProductCarts from '../../components/UserHome/MainProductCarts';

const GroupProducts = () => {
    const { dataState, dispatch } = useContext(useData);
    const location = useLocation();
    const path = location.pathname;
    const segments = useMemo(() => path.split('/').filter(segment => segment), [path]);

    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [mainTable, setMainTable] = useState('');

    useEffect(() => {
        if (segments.length > 0 && dataState?.productStorage) {
            const categoryFromURL = segments[1];
            const subCategoryFromURL = segments.length > 2 ? segments[2] : categoryFromURL;
            const mainTableFromData = segments.length > 2
                ? GetMainTable(subCategoryFromURL, dataState.productStorage.category, dataState.productStorage.subCategory)
                : categoryFromURL;

            if (category !== categoryFromURL) setCategory(categoryFromURL);
            if (subCategory !== subCategoryFromURL) setSubCategory(subCategoryFromURL);
            if (mainTable !== mainTableFromData) setMainTable(mainTableFromData);
        }
        window.scrollTo(0, 0);
    }, [segments, dataState.productStorage, category, subCategory, mainTable]);

    useEffect(() => {
        if (dataState.pathSettings.currPath !== location.pathname) {
            dispatch({ type: 'set_path_setting', payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname } });
        }
    }, [location.pathname, dataState.pathSettings.currPath]);

    if (!category || !subCategory || !mainTable) {
        return <div>Loading...</div>;
    }

    return (
        <section className={styles.GroupMainContainer}>
            <ParentDescendant segments={segments} category={category} subCategory={subCategory} />
            <section className={styles.CategoryChildContainer}>
                {subCategory && <CategoryChildContainer category={category} subCategory={subCategory} />}
            </section>
            <MainProductCarts MainTable={mainTable} SubCategory={subCategory} category={category} />
        </section>
    );
};

export default React.memo(GroupProducts);
