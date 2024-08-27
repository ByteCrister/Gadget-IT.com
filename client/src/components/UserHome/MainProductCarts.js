import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/GroupProductCatrs.module.css';
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
                            : item.brand.toLowerCase() === SubCategory && item.main_category === MainTable;
                    }
                    return item.main_category === category && item.brand.toLowerCase() === SubCategory;
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
    }, [MainTable, SubCategory, dataState]);

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
                const price = getPrices(item.product_id);
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
                    return valueToCheck.includes(sortItem.value.toLowerCase());
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

    return (
        <section className={styles.FullProductContainer}>
            <div className={styles.filtering_sorting}>
                <GroupProductSorting MainCategory={MainTable} handleProductFiltersByPrice={handleProductFiltersByPrice} handleCheckProductFilter={handleCheckProductFilter} />
            </div>

            <section className={styles.MainGroupCarts}>
                <div className={styles.UpperSort}>
                    <span>{GetCategoryName(SubCategory)}</span>
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
