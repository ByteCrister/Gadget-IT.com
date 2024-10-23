import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa';

import styles from '../../styles/AdminHome/ManageOffers.module.css';
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';

const SelectOfferProducts = () => {
    const { dataState, dispatch } = useContext(useData);
    const [offerProducts, setOfferProducts] = useState({
        ProductStorage: [],
        offerProductsMain: [],
        filteredOfferProducts: []
    });
    const [UpdateStatus, setUpdateStatus] = useState({
        insert: [],
        deleted: [],
        updated: []
    });
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
            })
            setOfferProducts({
                ProductStorage: initialized,
                offerProductsMain: initialized,
                filteredOfferProducts: initialized
            });
            dataState?.Setting_Page?.offer_carts.forEach((offer) => {
                const AllOfferProducts = dataState.Setting_Page.offer_carts_products.filter((offer_) => offer_.offer_cart_no === offer.cart_no).map((offer_) => offer_.serial_no);
                setMaxSerialNo((prev) => ({ ...prev, ['_' + offer.cart_no]: AllOfferProducts.length > 0 ? Math.max(...AllOfferProducts) : 0 }));
                console.log(AllOfferProducts);
                console.log(JSON.stringify(maxSerialNo, null, 2));
            });
        }
        // console.log(dataState.Production_Page.TableRows);
        // offer_carts_products
    }, [dataState.Setting_Page])

    const handleFilteredData = (data) => {
        setOfferProducts((prev) => ({
            ...prev,
            filteredOfferProducts: data
        }));
    };

    const findInitialSerial = (product_id) => {
        const product = dataState?.Setting_Page?.offer_carts_products.find((product) => product.product_id === product_id);
        return product ? product.serial_no : 0;
    };

    const findInitialOffer = (product_id) => {
        const product = dataState?.Setting_Page?.offer_carts_products.find((product) => product.product_id === product_id);
        return product ? product.offer_cart_no : 0;
    };

    const findSerial = (product_id) => {
        const product = offerProducts.ProductStorage.find((product) => product.product_id === product_id);
        return product ? product.serial_no : 0;
    };

    const findOffer = (product_id) => {
        const product = offerProducts.ProductStorage.find((product) => product.product_id === product_id);
        return product ? product.offer : 0;
    };


    const handleSearch = () => {

    };

    const isChecked = (product_id) => {
        return offerProducts.ProductStorage.some((product) => product.product_id === product_id && product.offer !== 0 && product.serial_no !== 0);
    };

    const isDeleted = (product_id) => {
        return UpdateStatus.deleted.some((pID) => pID === product_id);
    };

    const isThere = (keyState, product_id) => {
        return UpdateStatus[keyState].some((product) => product.product_id === product_id);
    };

    const handleCheckChange = (e, product_id) => {
        const isChecked = e.target.checked;
        let Updated = [...offerProducts.ProductStorage];
        if (isChecked) {
            if (findOffer(product_id) !== 0) {
                Updated = offerProducts.ProductStorage.map((offer) => {
                    return offer.product_id === product_id ? { ...offer, serial_no: maxSerialNo['_' + offer.offer] + 1 } : offer
                });
                if (isThere('insert', product_id)) {
                    setUpdateStatus((prev) => ({
                        ...prev,
                        insert: prev.insert.map((offer) => offer.product_id === product_id ? { ...offer, serial_no: maxSerialNo['_' + offer.offer] + 1 } : offer)
                    }));
                } else if (isThere('updated', product_id)) {
                    setUpdateStatus((prev) => ({
                        ...prev,
                        updated: prev.updated.map((offer) => offer.product_id === product_id ? { ...offer, serial_no: maxSerialNo['_' + offer.offer] + 1 } : offer)
                    }));
                }
                setMaxSerialNo((prev) => ({
                    ...prev,
                    ['_' + findOffer(product_id)]: prev['_' + findOffer(product_id)] + 1
                }));
            }
        } else {
            let currSerial = findSerial(product_id);
            let currOffer = findOffer(product_id);
            Updated = offerProducts.ProductStorage.map((offer) => {
                return offer.product_id === product_id ? { ...offer, serial_no: 0 } : { ...offer, serial_no: offer.offer === currOffer ? (currSerial < offer.serial_no) ? offer.serial_no - 1 : offer.serial_no : offer.serial_no }
            });
            if (isThere('insert', product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    insert: prev.insert.map((offer) => {
                        return offer.product_id === product_id ? { ...offer, serial_no: 0 } : { ...offer, serial_no: offer.offer === currOffer ? (currSerial < offer.serial_no) ? offer.serial_no - 1 : offer.serial_no : offer.serial_no }
                    })
                }));
            } else if (isThere('updated', product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    updated: prev.updated.map((offer) => {
                        return offer.product_id === product_id ? { ...offer, serial_no: 0 } : { ...offer, serial_no: offer.offer === currOffer ? (currSerial < offer.serial_no) ? offer.serial_no - 1 : offer.serial_no : offer.serial_no }
                    })
                }));
            }
            setMaxSerialNo((prev) => ({
                ...prev,
                ['_' + findOffer(product_id)]: prev['_' + findOffer(product_id)] > 0 ? prev['_' + findOffer(product_id)] - 1 : prev['_' + findOffer(product_id)]
            }));
        }

        setOfferProducts((prev) => ({
            ...prev,
            ProductStorage: Updated,
            offerProductsMain: Updated,
        }));
    };

    const handleSelectChange = (e, product_id) => {
        const selectedOffer = parseInt(e.target.value);

        let Updated;
        if (selectedOffer !== 0) {
            Updated = offerProducts.ProductStorage.map((offer_) => {
                return offer_.product_id === product_id ? { ...offer_, offer: selectedOffer, serial_no: maxSerialNo['_' + selectedOffer] + 1 } : offer_
            });
            if (isDeleted(product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    deleted: prev.deleted.filter((pId) => pId !== product_id),
                    updated: [...prev.updated, Updated.find((offer) => offer.product_id === product_id)]
                }));
            } else if (!isThere('insert', product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    insert: [...prev.insert, Updated.find((offer) => offer.product_id === product_id)]
                }));
            }
            setMaxSerialNo((prev) => ({
                ...prev,
                ['_' + selectedOffer]: prev['_' + selectedOffer] + 1
            }));
        } else {
            const currOffer = findOffer(product_id);
            Updated = offerProducts.ProductStorage.map((offer_) => {
                return offer_.product_id === product_id ? { ...offer_, offer: 0, serial_no: 0 } : { ...offer_, serial_no: offer_.offer === currOffer ? (findSerial(product_id) < offer_.serial_no) ? offer_.serial_no - 1 : offer_.serial_no : offer_.serial_no }
            });
            if (isThere('insert', product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    insert: prev.insert.filter((product) => product.product_id !== product_id)
                }));
            } else if (!isDeleted(product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    deleted: [...prev.deleted, product_id]
                }));
            } else if (isThere('updated', product_id)) {
                setUpdateStatus((prev) => ({
                    ...prev,
                    updated: prev.updated.filter((product) => product.product_id !== product_id)
                }));
            }
            setMaxSerialNo((prev) => ({
                ...prev,
                ['_' + currOffer]: prev['_' + currOffer] > 0 ? prev['_' + currOffer] - 1 : prev['_' + currOffer]
            }));
        }
        setOfferProducts((prev) => ({
            ...prev,
            ProductStorage: Updated,
            offerProductsMain: Updated
        }));

        console.log(JSON.stringify(Updated, null, 2));
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
                <button>Update New Changes</button>
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

export default SelectOfferProducts