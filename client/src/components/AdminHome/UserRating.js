import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";

import styles from "../../styles/AdminHome/UserRating.module.css";
import Pagination from "../../HOOKS/Pagination";
import { useData } from "../../context/useData";
import { GetCategoryName } from "../../HOOKS/GetCategoryName";
import { SearchRatings } from "../../HOOKS/SearchRatings";

const UserRating = () => {
    const { dataState, dispatch } = useContext(useData);
    const [RatingProducts, setRatingProducts] = useState({
        searchRatingProduct: [],
        RatingProductsMain: [],
        filteredRatingProducts: [],
    });
    const [sortButtonState, setSortButtonState] = useState({
        accedingState: 0,
        descendingState: 0
    });
    const [RatingInfoState, setRatingInfoState] = useState([]);
    const [toggleRatingInfo, setToggleRatingInfo] = useState(false);
    const searchRef = useRef();

    useEffect(() => {
        if (
            dataState?.Support_Page?.rating &&
            dataState.Production_Page?.TableFullRows
        ) {
            const updateRatings = dataState.Support_Page.rating.map((rating) => {
                return {
                    ...rating,
                    main_category: findCategory(rating.product_id),
                    status: findStatus(rating.rating_stars),
                };
            });
            setRatingProducts({
                searchRatingProduct: updateRatings,
                RatingProductsMain: updateRatings,
                filteredRatingProducts: updateRatings,
            });
            dispatch({
                type: 'set_search_function',
                payload: {
                    function: SearchRatings,
                    params: {
                        p_1: RatingProducts,
                        p_2: setRatingProducts
                    }
                }
            });
        }
        // console.log(dataState.Production_Page.TableFullRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataState.Support_Page.rating, dataState.Production_Page, dispatch, RatingProducts]);
    const findCategory = (productId) => {
        return dataState.Production_Page.TableFullRows.find(
            (product) => product.product_id === productId
        ).main_category;
    };

    const findStatus = (rating) => {
        return Number(rating) >= 4 ? "Very Good" : Number(rating) === 3 ? "Good" : "Below average!";
    };

    const handleFilteredData = (data) => {
        setRatingProducts((prev) => ({ ...prev, filteredRatingProducts: data }));
    };

    const handleSearch = () => {
        setSortButtonState({ accedingState: 0, descendingState: 0 });
        SearchRatings(searchRef.current.value, RatingProducts, setRatingProducts);
    };

    const handleSort = (stateKey, isAcceding) => {
        setRatingProducts((prev) => {
            let sortedProducts = [...prev.RatingProductsMain];

            if (sortButtonState[stateKey] + 1 === 5) {
                sortedProducts.sort((a, b) =>
                    isAcceding ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
                );
            } else if (sortButtonState[stateKey] + 1 === 4) {
                sortedProducts.sort((a, b) =>
                    isAcceding ? a.rating_stars - b.rating_stars : b.rating_stars - a.rating_stars
                );
            } else if (sortButtonState[stateKey] + 1 === 3) {
                sortedProducts.sort((a, b) =>
                    isAcceding ? a.no_of_rating - b.no_of_rating : b.no_of_rating - a.no_of_rating
                );
            } else if (sortButtonState[stateKey] + 1 === 2) {
                sortedProducts.sort((a, b) =>
                    isAcceding ? a.main_category.localeCompare(b.main_category) : b.main_category.localeCompare(a.main_category)
                );
            } else if (sortButtonState[stateKey] + 1 === 1) {
                sortedProducts.sort((a, b) =>
                    isAcceding ? a.product_id - b.product_id : b.product_id - a.product_id
                );
            } else {
                sortedProducts = [...prev.searchRatingProduct];
            }

            return {
                ...prev,
                RatingProductsMain: sortedProducts
            };
        });
    };

    const handleBtnUpdate = (stateKey) => {
        const isAcceding = stateKey === "accedingState" ? true : false;
        const oppositeState = isAcceding ? "descendingState" : "accedingState";
        setSortButtonState((prevState) => {

            const newSortState = {
                [stateKey]: prevState[stateKey] < 5 ? prevState[stateKey] + 1 : 0,
                [oppositeState]: 0,
            };

            return {
                ...prevState,
                ...newSortState,
            };
        });
        handleSort(stateKey, isAcceding);
    };

    const handleRatingInfo = (product_id) => {
        setRatingInfoState(dataState.Support_Page.allRating.filter((rating) => rating.product_id === product_id));
        setToggleRatingInfo(true);
    };


    return (
        <section className={styles.UserRatingSupportContainer}>
            <section className={styles.RatingSearchAndSort}>
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
                <div className={styles.RatingSortButtons}>
                    <button
                        className={
                            sortButtonState.accedingState === 0
                                ? styles.defaultBtn
                                : styles.activeBtn
                        }
                        onClick={() => handleBtnUpdate("accedingState")}
                    >
                        <FaSortAlphaDown />
                    </button>
                    <button
                        className={
                            sortButtonState.descendingState === 0
                                ? styles.defaultBtn
                                : styles.activeBtn
                        }
                        onClick={() => handleBtnUpdate("descendingState")}>
                        <FaSortAlphaDownAlt />
                    </button>
                </div>
            </section>

            {/* ------------- Rating table ------------- */}
            <section className={styles.UserRatingTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th className={sortButtonState.accedingState === 1 || sortButtonState.descendingState === 1 ? styles.activeTableBtn : null}>Product ID</th>
                            <th className={sortButtonState.accedingState === 2 || sortButtonState.descendingState === 2 ? styles.activeTableBtn : null}>Product Category</th>
                            <th className={sortButtonState.accedingState === 3 || sortButtonState.descendingState === 3 ? styles.activeTableBtn : null}>No. of Rating's</th>
                            <th className={sortButtonState.accedingState === 4 || sortButtonState.descendingState === 4 ? styles.activeTableBtn : null}>Average Rating</th>
                            <th className={sortButtonState.accedingState === 5 || sortButtonState.descendingState === 5 ? styles.activeTableBtn : null}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RatingProducts.filteredRatingProducts &&
                            RatingProducts.filteredRatingProducts.length > 0 &&
                            RatingProducts.filteredRatingProducts.map((rating) => {
                                return (
                                    <tr key={rating.product_id} onClick={() => handleRatingInfo(rating.product_id)}>
                                        <td>{rating.product_id}</td>
                                        <td>{GetCategoryName(rating.main_category)}</td>
                                        <td>{rating.no_of_rating}</td>
                                        <td>{Number(rating.rating_stars).toFixed(2)}</td>
                                        <td>{rating.status}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {
                    toggleRatingInfo && <section className={styles.RatingInfo}>
                        {
                            RatingInfoState &&
                            RatingInfoState.length > 0 &&
                            RatingInfoState.map((rating) => {
                                return <div>
                                    <span>{'['}{rating.user_id}{']'}</span>
                                    <span>{rating.email}</span>
                                    <span>{rating.rating_stars}*</span>
                                    <span>{new Date(rating.rating_date).toLocaleString()}</span>
                                </div>
                            })
                        }
                        <button onClick={() => setToggleRatingInfo(false)}>Back</button>
                    </section>
                }

            </section>

            {/* ------------- Table pagination ------------- */}
            <Pagination
                productsData={RatingProducts.RatingProductsMain}
                handleFilteredData={handleFilteredData}
            />
        </section>
    );
};

export default React.memo(UserRating);
