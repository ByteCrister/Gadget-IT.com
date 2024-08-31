import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/HomePageStyles/GroupProductSorting.module.css';
import { useData } from '../../context/useData';
import { GetSortObjects } from '../../HOOKS/GetSortObjects';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const GroupProductSorting = ({ MainCategory, handleProductFiltersByPrice, handleCheckProductFilter }) => {
    const { dataState } = useContext(useData);
    const [sorting_sections, setSorting_sections] = useState([]);
    const [startingPrice, setStartingPrice] = useState('');
    const [endingPrice, setEndingPrice] = useState('');
    const [error, setError] = useState('');
    const [selectFilterColumnsValues, setSelectedFilterColumnsValue] = useState([{ column: '', value: '' }]);
    const [sortValueShowMore, setSortValueShowMore] = useState({});
    const [sectionVisibility, setSectionVisibility] = useState({}); // State to track visibility of checkboxes

    useEffect(() => {
        // Find the relevant product table
        const productTable = dataState.productStorage.product_table.find(item => item.table === MainCategory);

        if (productTable) {
            const newSortingSections = productTable.product_sorting.filter(item => item.category === MainCategory);
            setSorting_sections(newSortingSections);

            // Initialize the "show more" state for each sorting section and visibility state
            const showMoreInitState = {};
            const visibilityInitState = {};
            newSortingSections.forEach((section) => {
                const sortObjects = GetSortObjects(section.sort_by_names);
                sortObjects.forEach((sortValue) => {
                    const key = Object.keys(sortValue)[0];
                    showMoreInitState[key] = { max_length: 4, values: sortValue[key] };
                    visibilityInitState[key] = true; // Set to true initially (visible)
                });
            });
            setSortValueShowMore(showMoreInitState);
            setSectionVisibility(visibilityInitState); // Set initial visibility
        }
    }, [MainCategory, dataState.productStorage.product_table]);

    //* Handle price filter
    const handleFilterClick = () => {
        const start = Number(startingPrice);
        const end = Number(endingPrice);

        if (start < 0 || end < 0) {
            setError('Price values cannot be negative.');
            return;
        }

        if (start > end) {
            setError('Starting price must be less than ending price.');
            return;
        }

        setError('');
        handleProductFiltersByPrice({ start, end });
    };

    //* Handle checked filter
    const handleCheckedFilter = (e, item, sorting_column) => {
        const isChecked = e.target.checked;
        let currentSorts = [...selectFilterColumnsValues];

        if (isChecked) {
            currentSorts = [...currentSorts, { column: sorting_column, value: item }];
        } else {
            currentSorts = currentSorts.filter((filter) => filter.column !== sorting_column || filter.value !== item);
        }

        setSelectedFilterColumnsValue(currentSorts);
        handleCheckProductFilter(currentSorts);
    };

    //* Toggle show more/less
    const toggleShowMore = (key) => {
        setSortValueShowMore((prevState) => ({
            ...prevState,
            [key]: {
                ...prevState[key],
                max_length: prevState[key].max_length === 4 ? prevState[key].values.length : 4
            }
        }));
    };

    //* Toggle visibility of checkboxes
    const toggleSectionVisibility = (key) => {
        setSectionVisibility((prevState) => ({
            ...prevState,
            [key]: !prevState[key] // Toggle visibility
        }));
    };

    return (
        <>
            <section className={styles.main_sort_section}>
                <div className={styles.upper_head_text}>
                    <span className={styles.head_text}>Price Range</span>
                    <div className={styles.line_div}></div>
                </div>

                <div className={styles.down_div}>
                    <input
                        type='number'
                        min={0}
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        placeholder="Minimum"
                    />
                    <input
                        type='number'
                        min={0}
                        value={endingPrice}
                        onChange={(e) => setEndingPrice(e.target.value)}
                        placeholder="Maximum"
                    />
                </div>
                {error && <div className={styles.error_message}>{error}</div>}
                <button onClick={handleFilterClick}>Filter</button>
            </section>

            {sorting_sections.length > 0 &&
                sorting_sections.map((section) => {
                    const sorting_column = section.sorting_column;
                    const sortObjects = GetSortObjects(section.sort_by_names);

                    return sortObjects.map((sortValue) => {
                        const key = Object.keys(sortValue)[0];
                        const values = sortValueShowMore[key]?.values || [];
                        const maxLength = sortValueShowMore[key]?.max_length || 4;
                        const isVisible = sectionVisibility[key]; // Check visibility state

                        return (
                            <section key={key} className={styles.main_sort_section}>
                                <div className={styles.upper_head_text}>
                                    <div className={styles.upper_head}>
                                        <span className={styles.head_text}>{key}</span>
                                        <span className={styles.low_and_up_symbol} onClick={() => toggleSectionVisibility(key)}>
                                            {isVisible ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </div>
                                    <div className={styles.line_div}></div>
                                </div>

                                {isVisible && (
                                    <div className={styles.check_boxes}>
                                        {values.slice(0, maxLength).map((value, index) => (
                                            <div key={index}>
                                                <input
                                                    type='checkbox'
                                                    onChange={(e) => handleCheckedFilter(e, value, sorting_column)}
                                                />
                                                <span>{value}</span>
                                            </div>
                                        ))}
                                        {values.length > 4 && (
                                            <span
                                                className={styles.show_more}
                                                onClick={() => toggleShowMore(key)}
                                            >
                                                {maxLength === 4 ? 'Show more...' : 'Show less...'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    });
                })}
        </>
    );
};

export default GroupProductSorting;
