import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FaFilter } from "react-icons/fa";

import styles from '../../styles/HomePageStyles/GroupProductCatrs.module.css';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import HomePagination from '../../HOOKS/HomePagination';
import ProductCart from '../../HOOKS/ProductCart';
import GroupProductSorting from './GroupProductSorting';


const MainProductCarts = React.memo(({ MainTable, SubCategory, category }) => {
    const { dataState } = useContext(useData);
    const [products, setProducts] = useState({
        MainProducts: [],
        FilteredProducts: []
    });
    const [staticMain, setStaticMain] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);



    useEffect(() => {
        const isMainCategory = (category) => dataState.categoryName.includes(category);

        if (dataState && dataState.productStorage && dataState.productStorage.product_table) {
            const filteredProductsTable = dataState.productStorage.product_table.find((item) => item.table === MainTable);

            if (filteredProductsTable && filteredProductsTable.table_products) {
                const filteredProducts = filteredProductsTable.table_products.filter((item) => {
                    if (MainTable === SubCategory) {
                        return item;
                    }
                    if (category === MainTable) {
                        return isMainCategory(SubCategory)
                            ? item.main_category === SubCategory
                            : item.sub_category.toLowerCase() === SubCategory && item.main_category === MainTable;
                    }
                    return item.main_category === category && item.sub_category.toLowerCase() === SubCategory;
                });

                setProducts({
                    MainProducts: filteredProducts,
                    FilteredProducts: filteredProducts
                });
                setStaticMain(filteredProducts);
            } else {
                console.error("Product table not found for the specified category.");
            }
        }
    }, [MainTable, SubCategory, category, dataState]);

    const handlePaginationFilter = useCallback((newFilteredProducts) => {
        setProducts((prev) => ({
            ...prev,
            FilteredProducts: newFilteredProducts
        }));
    }, []);

    const getPrices = useCallback((product_id) => {
        return dataState.productStorage.product_prices.find((item) => item.product_id === product_id)?.price || 0;
    }, [dataState.productStorage.product_prices]);

    const handlePriceSort = useCallback((e) => {
        const state = e.target.value;

        let sortedProducts = [...products.MainProducts];

        if (state === 'low-to-high') {
            sortedProducts.sort((a, b) => Number(getPrices(a.product_id)) - Number(getPrices(b.product_id)));
        } else if (state === 'high-to-low') {
            sortedProducts.sort((a, b) => Number(getPrices(b.product_id)) - Number(getPrices(a.product_id)));
        } else {
            sortedProducts = [...staticMain];
        }

        setProducts((prev) => ({
            ...prev,
            MainProducts: sortedProducts
        }));
    }, [getPrices, products.MainProducts, staticMain]);

    const handleProductFiltersByPrice = useCallback(({ start, end }) => {
        setProducts((prev) => ({
            ...prev,
            MainProducts: start && end ? prev.MainProducts.filter((item) => {
                const price = Number(getPrices(item.product_id));
                return price >= start && price <= end;
            }) : staticMain
        }));
    }, [getPrices, staticMain]);

    const handleCheckProductFilter = useCallback((currentSorts) => {
        if (currentSorts && currentSorts.length > 1) {
            let filteredProducts = [];

            currentSorts.slice(1).forEach((sortItem) => {
                const arr = staticMain.filter((item) => {
                    const valueToCheck = String(item[sortItem.column] || '').toLowerCase();
                    // return valueToCheck.includes(sortItem.value.toLowerCase());
                    return valueToCheck.split(' ').some((item)=> item === sortItem.value.toLowerCase());
                });
                arr.forEach((item) => filteredProducts.push(item));
            });

            setProducts((prev) => ({
                ...prev,
                MainProducts: filteredProducts
            }));
        } else {
            setProducts((prev) => ({
                ...prev,
                MainProducts: staticMain
            }));
        }
    }, [staticMain]);


    //*-------------------------- toggleFilterPanel --------------------
    const toggleFilterPanel = useCallback(() => {
        setIsFilterVisible(!isFilterVisible);
    }, [isFilterVisible]);


    const closeFilterPanel = useCallback(() => {
        setIsFilterVisible(false);
    }, []);

    return (
        <section className={styles.FullProductContainer}>

            <div className={`${styles.overlay} ${isFilterVisible ? styles.active : ''}`} onClick={closeFilterPanel}></div>

            <div className={`${styles.filtering_sorting} ${isFilterVisible ? styles.active : ''}`}>
                <GroupProductSorting MainCategory={MainTable} handleProductFiltersByPrice={handleProductFiltersByPrice} handleCheckProductFilter={handleCheckProductFilter} />
            </div>


            <section className={styles.MainGroupCarts}>

                <span className={styles.upper_category_name}>{GetCategoryName(SubCategory)}</span>

                <div className={styles.UpperSort}>
                    <span className={styles.category_name}>{GetCategoryName(SubCategory)}</span>
                    <button className={styles.sort_click_button} onClick={toggleFilterPanel}><FaFilter /> Filter</button>
                    <div>
                        <span>Sort By : </span>
                        <select onChange={handlePriceSort}>
                            <option value={''}>Default</option>
                            <option value={'low-to-high'}>Price Low to High</option>
                            <option value={'high-to-low'}>High to Low</option>
                        </select>
                    </div>
                </div>

                <div className={styles.GroupProductCart}>
                    {products.FilteredProducts.map((item) => (
                        <ProductCart key={item.product_id} product={item} />
                    ))}
                </div>

                <HomePagination productsData={products.MainProducts} handleFilteredData={handlePaginationFilter} handleCheckProductFilter={handleCheckProductFilter} />
            </section>
        </section>
    );
});

export default MainProductCarts;
