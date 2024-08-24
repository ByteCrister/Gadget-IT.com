import React, { useContext, useState } from 'react';
import style from '../../styles/AdminHome/addproducts.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import { Api_Inventory } from '../../api/Api_Inventory';
import { Api_Production } from '../../api/Api_Production';

const AddProducts = ({ setAddProductState }) => {
    const { dataState, dispatch } = useContext(useData);

    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [isSubCategorySelected, setIsSubCategorySelected] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [mainCategory, setMainCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [tableName, setTableName] = useState('');

    const [extraImages, setExtraImages] = useState([]);

    const [tableColumnValue, setTableColumnValue] = useState([]);
    const [newKeyValue, setNewKeyValue] = useState([]);
    const [newDescriptionHeadValue, setNewDescriptionHeadValue] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [mandatoryValues, setMandatoryValues] = useState({
        brand: '',
        mainCategory: '',
        subCategory: '',
        incoming: '',
        reserved: '',
        quantity: '',
        cut_price: '',
        price: '',
        image: null,
        product_name: '',
        vendor: ''

    });

    const [errors, setErrors] = useState({}); // To store validation errors

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value) {
            const filteredSubCategories = dataState.subCategoryName.filter(
                (values) => values.main_category_name === value
            );
            setMandatoryValues((prev) => ({ ...prev, mainCategory: value }));
            setSelectedSubCategory(filteredSubCategories);
            setMainCategory(value);
            setIsCategorySelected(true);
        } else {
            setIsCategorySelected(false);
            setIsSubCategorySelected(false);
        }
    };

    const handleSubCategoryChange = (e) => {
        const value = e.target.value;
        if (value) {
            axios
                .get(`http://localhost:7000/product_key_values/${mainCategory}`)
                .then((res) => {
                    setSubCategory(value);
                    setKeyAndValue(res.data.tableColumnNames);
                    setTableName(res.data.tableName);
                    setVendors(res.data.vendorNames);
                    setMandatoryValues((prev) => ({ ...prev, subCategory: value }));
                })
                .catch((err) => {
                    console.error('Error fetching product key values:', err);
                });

            setIsSubCategorySelected(true);
        } else {
            setIsSubCategorySelected(false);
        }
    };

    const handleChange = (e) => {
        const { id, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace(/^data:.+\/(.+);base64,/, '');
                const mimeType = file.type;

                setMandatoryValues((prevState) => ({
                    ...prevState,
                    image: {
                        base64: base64String,
                        mimeType: mimeType
                    }
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setMandatoryValues((prevState) => ({
                ...prevState,
                [id]: value
            }));
        }
    };

    const setKeyAndValue = (columns) => {
        const filteredColumns = columns.filter(
            (columnName) =>
                columnName !== 'product_id' &&
                columnName !== 'main_category' &&
                columnName !== 'product_name' &&
                columnName !== 'image' &&
                columnName !== 'vendor_no' &&
                columnName !== 'brand' &&
                columnName !== 'hide'
        );
        setTableColumnValue(filteredColumns.map((columnName) => ({
            key: columnName,
            value: ''
        })));
    };

    const handleInitialProductKeyValue = (e, index) => {
        const { value } = e.target;
        setTableColumnValue((prevState) => {
            const updatedValues = [...prevState];
            updatedValues[index].value = value;
            return updatedValues;
        });
    };



    // ------------------------------New Description Function-----------------------------------------

    const handleNewDescriptionHeadValue = () => {
        setNewDescriptionHeadValue((prev) => [
            ...prev,
            { head: '', value: '' }
        ]);
    };

    const handleDescriptionHeadValue = (e, index, type) => {
        const { value } = e.target;
        setNewDescriptionHeadValue((prevState) => {
            const updatedValues = [...prevState];
            if (type === 'head') {
                updatedValues[index].head = value;
            } else {
                updatedValues[index].value = value;
            }
            return updatedValues;
        });
    };
    const handleDeleteDescriptionHeadValue = (index) => {
        setNewDescriptionHeadValue((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };


    // ----------------------------New Product Column Function----------------------------------------
    const handleNewKeyPoint = () => {
        setNewKeyValue((prev) => [
            ...prev,
            { key: '', value: '' }
        ]);
    };

    const handleManageNewKeyValue = (e, index, type) => {
        const { value } = e.target;
        setNewKeyValue((prevState) => {
            const updatedValues = [...prevState];
            if (type === 'key') {
                updatedValues[index].key = value;
            } else {
                updatedValues[index].value = value;
            }
            return updatedValues;
        });
    };

    const handleDeleteKeyValue = (index) => {
        setNewKeyValue((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };


    // ------------------------------ New Extra Images ----------------------------------------------
    const handleExtraImages = () => {
        setExtraImages((prev) => [...prev, { base64: '', mimeType: '' }]);
    };
    const handleNewExtraImage = (e, index) => {
        const { type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace(/^data:.+\/(.+);base64,/, '');
                const mimeType = file.type;
                setExtraImages((prev) => {
                    const updatedImages = [...prev];
                    updatedImages[index] = { base64: base64String, mimeType: mimeType };
                    return updatedImages;
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDeleteExtraImages = (index) => {
        setExtraImages((prev) =>
            prev.filter((_, i) => i !== index));
    }

    /* ********************** validation *********************** */
    const validateForm = () => {
        const errors = {};
        // Required fields
        if (!mandatoryValues.brand) errors.brand = "Brand is required.";
        if (!mandatoryValues.product_name) errors.product_name = "Product Name is required.";
        if (!mandatoryValues.incoming) errors.incoming = "Incoming value is required.";
        if (!mandatoryValues.reserved) errors.reserved = "Reserved value is required.";
        if (!mandatoryValues.quantity) errors.quantity = "Quantity is required.";
        if (!mandatoryValues.cut_price) errors.cut_price = "Cut Price is required.";
        if (!mandatoryValues.price) errors.price = "Price is required.";
        if (!mandatoryValues.image) errors.image = "Image is required.";
        if (!mainCategory) errors.mainCategory = "Main Category is required.";
        if (!subCategory) errors.subCategory = "Sub Category is required.";
        if (!mandatoryValues.vendor) errors.vendor = "Vendor is required.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // ************************************ Post New Product ********************************************
    const handleAddProduct = () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            table: tableName,
            newKeyValue: newKeyValue,
            tableColumnValue: tableColumnValue,
            mandatoryValues: mandatoryValues,
            newDescriptionHeadValue: newDescriptionHeadValue,
            extraImages: extraImages
        };
        // console.log(tableName);
        // console.log(JSON.stringify(extraImages));
        // console.log(JSON.stringify(tableColumnValue));
        // console.log(JSON.stringify(mandatoryValues));

        axios
            .post('http://localhost:7000/post/new/product', payload)
            .then((response) => {
                setAddProductState(false);
                 Api_Inventory(dispatch);
                 Api_Production(dispatch);

                console.log('Product added successfully:', response.data);
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
    };
    // *********************************************************************************

    return (
        <div id={style.addProductsMainContainer}>
            <form>
                <div id={style.SelectCategory}>
                    <div id={style.mainCategory}>
                        <label htmlFor='category'>Select Main Category</label>
                        <select onChange={handleCategoryChange}>
                            <option value=''>Select...</option>
                            {dataState.categoryName.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                        {errors.mainCategory && <p className={style.error}>{errors.mainCategory}</p>}
                    </div>
                    {isCategorySelected && (
                        <div id={style.subCategory}>
                            <label htmlFor='subCategory'>Select Sub Category</label>
                            <select onChange={handleSubCategoryChange}>
                                <option value=''>Select...</option>
                                {selectedSubCategory.map((value) => (
                                    <option key={value.sub_category_name} value={value.sub_category_name}>
                                        {value.sub_category_name}
                                    </option>
                                ))}
                            </select>
                            {errors.subCategory && <p className={style.error}>{errors.subCategory}</p>}
                        </div>
                    )}
                </div>

                {isCategorySelected && isSubCategorySelected && (
                    <>
                        <div id={style.InitialValueSet}>
                            <div>
                                <label htmlFor='brand'><sup>*</sup>Brand</label>
                                <input type='text' id='brand' onChange={handleChange} />
                                {errors.brand && <p className={style.error}>{errors.brand}</p>}
                            </div>
                            <div>
                                <label htmlFor='product_name'><sup>*</sup>Product Name</label>
                                <input type='text' id='product_name' onChange={handleChange} />
                                {errors.product_name && <p className={style.error}>{errors.product_name}</p>}
                            </div>
                            <div>
                                <label htmlFor='incoming'><sup>*</sup>Incoming</label>
                                <input type='number' id='incoming' onChange={handleChange} />
                                {errors.incoming && <p className={style.error}>{errors.incoming}</p>}
                            </div>
                            <div>
                                <label htmlFor='reserved'><sup>*</sup>Reserved</label>
                                <input type='number' id='reserved' onChange={handleChange} />
                                {errors.reserved && <p className={style.error}>{errors.reserved}</p>}
                            </div>
                            <div>
                                <label htmlFor='quantity'><sup>*</sup>Quantity</label>
                                <input type='number' id='quantity' onChange={handleChange} />
                                {errors.quantity && <p className={style.error}>{errors.quantity}</p>}
                            </div>
                            <div>
                                <label htmlFor='cut_price'><sup>*</sup>Cut Price</label>
                                <input type='number' id='cut_price' onChange={handleChange} />
                                {errors.cut_price && <p className={style.error}>{errors.cut_price}</p>}
                            </div>
                            <div>
                                <label htmlFor='price'><sup>*</sup>Price</label>
                                <input type='number' id='price' onChange={handleChange} />
                                {errors.price && <p className={style.error}>{errors.price}</p>}
                            </div>
                            <div id={style.vendor_select}>
                                <label htmlFor='vendor'><sup>*</sup>Vendor</label>
                                <select id='vendor' onChange={handleChange}>
                                    <option value=''>Select Vendor...</option>
                                    {vendors.map((vendor, index) => (
                                        <option key={index} value={vendor.vendor_no}>{vendor.vendor_name}</option>
                                    ))}
                                </select>
                                {errors.vendor && <p className={style.error}>{errors.vendor}</p>}
                            </div>
                            <div>
                                <label htmlFor='image'><sup>*</sup>Image</label>
                                <input type='file' id='image' onChange={handleChange} />
                                {errors.image && <p className={style.error}>{errors.image}</p>}
                            </div>
                        </div>

                        <div id={style.InitialValueSet}>
                            {tableColumnValue.map((column, index) => (
                                <div key={index}>
                                    <label htmlFor={`initial_value${index}`}>{column.key}</label>
                                    <input
                                        type='text'
                                        id={`initial_value${index}`}
                                        value={column.value}
                                        onChange={(e) => handleInitialProductKeyValue(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* ---------------------------------------------------------------------------------------------- */}
                        <div id={style.InitialValueSet} style={{ marginTop: '10px' }}>
                            {newKeyValue.map((value, index) => (
                                <div key={index} style={{ backgroundColor: '#ebebeb', padding: '8px 12px' }}>
                                    <input
                                        type='text'
                                        id='newKey'
                                        value={value.key}
                                        onChange={(e) => handleManageNewKeyValue(e, index, 'key')}
                                        placeholder='Key'
                                    />
                                    <input
                                        type='text'
                                        id='newValue'
                                        value={value.value}
                                        onChange={(e) => handleManageNewKeyValue(e, index, 'value')}
                                        placeholder='Value'
                                    />
                                    <button type='button' id={style.button} onClick={() => handleDeleteKeyValue(index)}>Delete</button>
                                </div>
                            ))}
                            <button type='button' id={style.button} onClick={handleNewKeyPoint}>+ Add Key Point</button>
                        </div>
                        {/* ------------------------------------------------------------------------------------------------ */}
                        <div id={style.InitialValueSet} style={{ marginTop: '15px' }}>
                            {newDescriptionHeadValue.map((value, index) => (
                                <div key={index} style={{ backgroundColor: '#ebebeb', padding: '8px 12px' }}>
                                    <input
                                        type='text'
                                        id='des_head'
                                        value={value.head}
                                        onChange={(e) => handleDescriptionHeadValue(e, index, 'head')}
                                        placeholder='Head'
                                    />
                                    <input
                                        type='text'
                                        id='des_value'
                                        value={value.value}
                                        onChange={(e) => handleDescriptionHeadValue(e, index, 'value')}
                                        placeholder='Value'
                                    />
                                    <button type='button' id={style.button} onClick={() => handleDeleteDescriptionHeadValue(index)}>Delete</button>
                                </div>
                            ))}
                            <button type='button' id={style.button} onClick={handleNewDescriptionHeadValue}>+ Add Description</button>
                        </div>
                        {/* ------------------------------------------------------------------------------------------------ */}

                        {/* ------------------------------------------------------------------------------------------------- */}
                        <div id={style.InitialValueSet} style={{ marginTop: '20px', marginBottom: '20px' }}>
                            {extraImages.map((item, index) => (
                                <div key={index} className={style.extra_image_item}>
                                    <input
                                        type='file'
                                        onChange={(e) => handleNewExtraImage(e, index)}
                                    />
                                    <button type='button' id={style.button} onClick={() => handleDeleteExtraImages(index)}>Delete</button>
                                </div>
                            ))}
                            <button type='button' id={style.button} onClick={handleExtraImages}>+Add Extra Image</button>
                        </div>
                        {/* ------------------------------------------------------------------------------------------------- */}

                        <button type='button' id={style.button} onClick={handleAddProduct}>Add Product</button>

                    </>
                )}
            </form>
        </div>
    );
};

export default AddProducts;
