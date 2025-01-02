import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { TbCloudUpload } from "react-icons/tb";
import axios from 'axios';


import styles from '../../styles/AdminHome/ManageOffers.module.css';
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { SearchOfferProducts } from '../../HOOKS/SearchOfferProducts';

const SelectOfferProducts = () => {
    const { dataState, dispatch } = useContext(useData);
    const [offerProducts, setOfferProducts] = useState({
        ProductStorage: [],
        offerProductsMain: [],
        filteredOfferProducts: []
    });
    const [OfferShouldDelete, setOfferShouldDelete] = useState([]);
    const [maxSerialNo, setMaxSerialNo] = useState({});
    const searchRef = useRef();

    useEffect(() => {
        if (dataState?.Production_Page?.TableRows) {
            const initialized = dataState.Production_Page.TableRows.map((products) => {
                return {
                    product_id: products.id,
                    name: products.name,
                    category: products.type,
                    serial_no: findInitialSerial(products.id),
                    offer: findInitialOffer(products.id)
                }
            });
            setOfferProducts({
                ProductStorage: initialized,
                offerProductsMain: initialized,
                filteredOfferProducts: initialized
            });
            dataState?.Setting_Page?.offer_carts.forEach((offer) => {
                const AllOfferProducts = dataState.Setting_Page.offer_carts_products.filter((offer_) => offer_.offer_cart_no === offer.cart_no).map((offer_) => offer_.serial_no);
                setMaxSerialNo((prev) => ({ ...prev, [offer.cart_no]: AllOfferProducts.length > 0 ? Math.max(...AllOfferProducts) : 0 }));
            });
            dispatch({
                type: 'set_search_function',
                payload: {
                    function: SearchOfferProducts,
                    params: {
                        p_1: offerProducts,
                        p_2: setOfferProducts
                    }
                }
            })
        }
    }, [dataState.Setting_Page, dataState.Production_Page.TableRows])

    // 1
    const findInitialSerial = useCallback((product_id) => {
        const product = dataState?.Setting_Page?.offer_carts_products.find((product) => product.product_id === product_id);
        return product ? product.serial_no : 0;
    }, [dataState?.Setting_Page?.offer_carts_products]);
    // 2
    const findInitialOffer = useCallback((product_id) => {
        const product = dataState?.Setting_Page?.offer_carts_products.find((product) => product.product_id === product_id);
        return product ? product.offer_cart_no : 0;
    }, [dataState?.Setting_Page?.offer_carts_products]);
    // 3
    const findSerial = useCallback((product_id) => {
        const product = offerProducts.ProductStorage.find((product) => product.product_id === product_id);
        return product ? product.serial_no : 0;
    }, [offerProducts.ProductStorage]);
    // 4
    const findOffer = useCallback((product_id) => {
        const product = offerProducts.ProductStorage.find((product) => product.product_id === product_id);
        return product ? product.offer : 0;
    }, [offerProducts.ProductStorage]);

    //  5
    const handleSearch = () => {
        SearchOfferProducts(searchRef.current.value, offerProducts, setOfferProducts);
    };
    // 6
    const handleUpdateChanges = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer-product-select/Crud`, { UpdatedProducts: offerProducts.ProductStorage, OfferShouldDelete: [...OfferShouldDelete] });
            dispatch({ type: 'set_select_offer_products', payload: res.data });
        } catch (error) {
            console.log(error);
        }
    };
    // 7
    const isChecked = useCallback((product_id) => {
        return offerProducts.ProductStorage.some((product) => product.product_id === product_id && product.offer !== 0 && product.serial_no !== 0);
    }, [offerProducts.ProductStorage]);
    // 8
    const handleCheckChange = useCallback((e, product_id) => {
        const isChecked = e.target.checked;
        let Updated = [...offerProducts.ProductStorage];
        if (isChecked) {
            if (findOffer(product_id) !== 0) {
                Updated = Updated.map((offer) => {
                    return offer.product_id === product_id ? { ...offer, serial_no: maxSerialNo[offer.offer] + 1 } : offer
                });
                setMaxSerialNo((prev) => ({
                    ...prev,
                    [findOffer(product_id)]: prev[findOffer(product_id)] + 1
                }));
                const updatedDeleteOffer = OfferShouldDelete.some((id) => id === product_id) ? [...OfferShouldDelete.filter((id) => id !== product_id)] : [...OfferShouldDelete];
                setOfferShouldDelete([...updatedDeleteOffer]);
            }
        } else {
            let currSerial = findSerial(product_id);
            let currOffer = findOffer(product_id);
            Updated = Updated.map((offer) => {
                return offer.product_id === product_id ? { ...offer, serial_no: 0 } : currOffer === offer.offer ? { ...offer, serial_no: currSerial < offer.serial_no ? offer.serial_no - 1 : offer.serial_no } : offer
            });
            setMaxSerialNo((prev) => ({
                ...prev,
                [findOffer(product_id)]: prev[findOffer(product_id)] > 0 ? prev[findOffer(product_id)] - 1 : prev[findOffer(product_id)]
            }));
        }

        setOfferProducts((prev) => ({
            ...prev,
            ProductStorage: Updated,
            offerProductsMain: Updated,
        }));
    }, [OfferShouldDelete, findOffer, findSerial, maxSerialNo, offerProducts.ProductStorage]);
    // 9
    const handleSelectChange = useCallback((e, product_id) => {
        const selectedOffer = parseInt(e.target.value);
        const currOffer = findOffer(product_id);
        const currSerial = findSerial(product_id);

        let Updated = [...offerProducts.ProductStorage];
        Updated = Updated.map((offer) => {
            return offer.product_id === product_id ?
                { ...offer, offer: selectedOffer, serial_no: 0 }
                : currOffer === offer.offer && currSerial !== 0 ?
                    { ...offer, serial_no: currSerial < offer.serial_no ? offer.serial_no - 1 : offer.serial_no }
                    : offer
        });
        if (selectedOffer === 0) {
            const updatedDeleteOffer = OfferShouldDelete.some((id) => id === product_id) ? [...OfferShouldDelete] : [...OfferShouldDelete, product_id];
            setOfferShouldDelete([...updatedDeleteOffer]);
        }
        setMaxSerialNo((prev) => ({
            ...prev,
            [currOffer]: currSerial !== 0 ? prev[currOffer] - 1 : prev[currOffer]
        }));
        setOfferProducts((prev) => ({
            ...prev,
            ProductStorage: Updated,
            offerProductsMain: Updated
        }));

    }, [OfferShouldDelete, findOffer, findSerial, offerProducts.ProductStorage]);
    // 10
    const handleFilteredData = (data) => {
        setOfferProducts((prev) => ({
            ...prev,
            filteredOfferProducts: data
        }));
    };

    return (
        <section className={styles.UserOfferMainContainer}>
            <section className={styles.CreateAndSearch}>
                <div className={styles.searchFieldWrapper}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchField}
                        ref={searchRef}
                        onChange={handleSearch}
                    />
                    <FaSearch className={styles.searchIcon} />
                </div>
                <button onClick={handleUpdateChanges}><TbCloudUpload /></button>
            </section>

            <section className={styles.CreateOfferTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Serial no.</th>
                            <th>Offer no.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            offerProducts &&
                            offerProducts.filteredOfferProducts &&
                            offerProducts.filteredOfferProducts.map((row) => {
                                return <tr>
                                    <td>{row.product_id}</td>
                                    <td>{row.name}</td>
                                    <td>{GetCategoryName(row.category)}</td>
                                    <td>{findSerial(row.product_id)}<input type='checkbox' checked={isChecked(row.product_id)} onChange={(e) => handleCheckChange(e, row.product_id)}></input></td>
                                    <td>
                                        <select
                                            className={styles.OfferSelectOption}
                                            value={findOffer(row.product_id)}
                                            onChange={(e) => handleSelectChange(e, row.product_id)}>
                                            <option value={0} ></option>
                                            {
                                                dataState.Setting_Page.offer_carts.map((offer) => {
                                                    return <option value={offer.cart_no}>{offer.cart_no}</option>
                                                })
                                            }
                                        </select>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </section>

            <Pagination productsData={offerProducts.offerProductsMain} handleFilteredData={handleFilteredData} />
        </section>
    )
}

export default React.memo(SelectOfferProducts);