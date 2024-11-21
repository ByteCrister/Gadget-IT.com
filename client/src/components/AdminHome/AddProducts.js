import React, { useCallback, useContext, useState } from 'react';
import style from '../../styles/AdminHome/addproducts.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import Admin_Api from '../../api/Admin_Api';

const AddProducts = React.memo(({ setAddProductState, setErrorCategory }) => {
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
        price: '',
        image: null,
        product_name: '',
        vendor: '',
        discount_type: '',
        discount_value: null

    });

    const [errors, setErrors] = useState({});

    const handleCategoryChange = useCallback((e) => {
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
    }, [dataState.subCategoryName]);

    const handleSubCategoryChange = async (e) => {
        const value = e.target.value;
        if (value) {
            try {
                const res = await axios.get(`http://localhost:7000/product_key_values/${mainCategory}`);
                setSubCategory(value);
                setKeyAndValue(await res.data.tableColumnNames);
                setTableName(await res.data.tableName);
                setVendors(await res.data.vendorNames);
                setMandatoryValues((prev) => ({ ...prev, subCategory: value }));
                setIsSubCategorySelected(true);
            } catch (error) {
                console.log(error);
                window.alert("Error fetching product key values: " + error.message);
            }

        } else {
            setIsSubCategorySelected(false);
        }
    };

    const handleChange = useCallback((e) => {
        const { id, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];

            if (!file || !file.type.startsWith('image/')) {
                setErrorCategory({
                    message: 'The file is not an Image! Please give a valid image file.',
                    isError: true
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    const MAX_SIZE_KB = 50;
                    const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

                    // Resize canvas if necessary
                    if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
                        if (img.width > img.height) {
                            canvas.width = MAX_WIDTH;
                            canvas.height = (img.height / img.width) * MAX_WIDTH;
                        } else {
                            canvas.height = MAX_HEIGHT;
                            canvas.width = (img.width / img.height) * MAX_HEIGHT;
                        }
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    let quality = 0.9; // Initial quality
                    let compressedDataURL = canvas.toDataURL(file.type, quality);
                    let base64Length = atob(compressedDataURL.split(',')[1]).length;
                    let compressedDataSize = base64Length;

                    // Check size and reduce quality if needed
                    while (compressedDataSize > MAX_SIZE_BYTES && quality > 0) {
                        quality -= 0.05;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        compressedDataURL = canvas.toDataURL(file.type, quality);
                        base64Length = atob(compressedDataURL.split(',')[1]).length;
                        compressedDataSize = base64Length;
                    }

                    if (compressedDataSize > MAX_SIZE_BYTES) {
                        setErrorCategory({
                            message: 'Image size is greater than 50kb. Image size reduce under 50kb.',
                            isError: true
                        });
                        return;
                    }

                    // Set the compressed image in state
                    setMandatoryValues((prevState) => ({
                        ...prevState,
                        image: {
                            base64: compressedDataURL.replace(/^data:.+\/(.+);base64,/, ''),
                            mimeType: file.type
                        }
                    }));
                };

                img.onerror = () => {
                    setErrorCategory({
                        message: 'Failed to process the image. Please try again.',
                        isError: true
                    });
                };

                img.src = base64String;
            };

            reader.onerror = () => {
                setErrorCategory({
                    message: 'Failed to read the file. Please try again.',
                    isError: true
                });
            };

            reader.readAsDataURL(file);
        } else {
            setMandatoryValues((prevState) => ({
                ...prevState,
                [id]: value
            }));
        }
    }, [setErrorCategory, setMandatoryValues]);



    const setKeyAndValue = useCallback((columns) => {
        const filteredColumns = columns.filter(
            (columnName) =>
                columnName !== 'product_id' &&
                columnName !== 'main_category' &&
                columnName !== 'sub_category' &&
                columnName !== 'product_name' &&
                columnName !== 'image' &&
                columnName !== 'vendor_no' &&
                columnName !== 'brand' &&
                columnName !== 'hide' &&
                columnName !== 'discount_type' &&
                columnName !== 'discount_value'
        );
        setTableColumnValue(filteredColumns.map((columnName) => ({
            key: columnName,
            value: ''
        })));
    }, []);

    const handleInitialProductKeyValue = useCallback((e, index) => {
        const { value } = e.target;
        setTableColumnValue((prevState) => {
            const updatedValues = [...prevState];
            updatedValues[index].value = value;
            return updatedValues;
        });
    }, []);



    //* ------------------------------New Description Function-----------------------------------------

    const handleNewDescriptionHeadValue = useCallback(() => {
        setNewDescriptionHeadValue((prev) => [
            ...prev,
            { head: '', value: '' }
        ]);
    }, []);

    const handleDescriptionHeadValue = useCallback((e, index, type) => {
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
    }, []);

    const handleDeleteDescriptionHeadValue = useCallback((index) => {
        setNewDescriptionHeadValue((prev) =>
            prev.filter((_, i) => i !== index)
        );
    }, []);


    //* ----------------------------New Product Column Function----------------------------------------
    const handleNewKeyPoint = useCallback(() => {
        setNewKeyValue((prev) => [
            ...prev,
            { key: '', value: '' }
        ]);
    }, []);

    const handleManageNewKeyValue = useCallback((e, index, type) => {
        const { value } = e.target;
        setNewKeyValue((prevState) => {
            const updatedValues = [...prevState];
            if (type === 'key') {
                const key = e.nativeEvent.inputType;
                if (key === 'deleteContentBackward') {
                    updatedValues[index].key = value.slice(0, -1);
                    return updatedValues;
                }
                const trimmedText = e.target.value.trim();
                if ((trimmedText.length === 1 && trimmedText.charAt(0) === '_') || (trimmedText.charAt(trimmedText.length - 1) === '_' && trimmedText.charAt(trimmedText.length - 2) === '_')) {
                    return updatedValues;
                }
                const lastLetter = trimmedText.toLowerCase().charAt(trimmedText.length - 1);
                const acceptedLetters = 'abcdefghijklmnopqrstuvwxyz_';
                const isValid = acceptedLetters.includes(lastLetter);
                if (isValid) {
                    updatedValues[index].key = value;
                }
            } else {
                updatedValues[index].value = value;
            }
            return updatedValues;
        });
    }, []);

    const handleDeleteKeyValue = useCallback((index) => {
        setNewKeyValue((prev) =>
            prev.filter((_, i) => i !== index)
        );
    }, []);


    //* ------------------------------ New Extra Images ----------------------------------------------
    const handleExtraImages = useCallback(() => {
        setExtraImages((prev) => [...prev, { base64: '', mimeType: '' }]);
    }, []);


    const handleNewExtraImage = useCallback((e, index) => {
        const { type, files } = e.target;

        if (type === 'file') {
            const file = files[0];

            if (!file || !file.type.startsWith('image/')) {
                setErrorCategory({
                    message: 'The file is not an Image! Please give a valid image file.',
                    isError: true
                });
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result;
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    const MAX_SIZE_KB = 50;
                    const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

                    // Resize canvas if necessary
                    if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
                        if (img.width > img.height) {
                            canvas.width = MAX_WIDTH;
                            canvas.height = (img.height / img.width) * MAX_WIDTH;
                        } else {
                            canvas.height = MAX_HEIGHT;
                            canvas.width = (img.width / img.height) * MAX_HEIGHT;
                        }
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    let quality = 0.9; // Initial quality
                    let compressedDataURL = canvas.toDataURL(file.type, quality);
                    let base64Length = atob(compressedDataURL.split(',')[1]).length;
                    let compressedDataSize = base64Length;

                    // Reduce quality if size exceeds limit
                    while (compressedDataSize > MAX_SIZE_BYTES && quality > 0) {
                        quality -= 0.05;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        compressedDataURL = canvas.toDataURL(file.type, quality);
                        base64Length = atob(compressedDataURL.split(',')[1]).length;
                        compressedDataSize = base64Length;
                    }

                    if (compressedDataSize > MAX_SIZE_BYTES) {
                        setErrorCategory({
                            message: 'Image size is greater than 50KB. Please reduce it under 50KB.',
                            isError: true
                        });
                        return;
                    }

                    const mimeType = file.type;

                    // Update the state with the compressed image
                    setExtraImages((prev) => {
                        const updatedImages = [...prev];
                        updatedImages[index] = {
                            base64: compressedDataURL.replace(/^data:.+\/(.+);base64,/, ''),
                            mimeType: mimeType
                        };
                        return updatedImages;
                    });
                };

                img.onerror = () => {
                    setErrorCategory({
                        message: 'Failed to process the image. Please try again.',
                        isError: true
                    });
                };

                img.src = base64String;
            };

            reader.onerror = () => {
                setErrorCategory({
                    message: 'Failed to read the file. Please try again.',
                    isError: true
                });
            };

            reader.readAsDataURL(file);
        }
    }, [setErrorCategory, setExtraImages]);


    const handleDeleteExtraImages = useCallback((index) => {
        setExtraImages((prev) =>
            prev.filter((_, i) => i !== index));
    }, []);

    /* ********************** validation *********************** */
    const validateForm = () => {
        const errors = {};
        // Required fields
        if (!mandatoryValues.brand) errors.brand = "Brand is required.";
        if (!mandatoryValues.product_name) errors.product_name = "Product Name is required.";
        if (!mandatoryValues.incoming) errors.incoming = "Incoming value is required.";
        if (!mandatoryValues.reserved) errors.reserved = "Reserved value is required.";
        if (!mandatoryValues.quantity) errors.quantity = "Quantity is required.";
        if (!mandatoryValues.price) errors.price = "Price is required.";
        if (!mandatoryValues.image) errors.image = "Image is required.";
        if (!mandatoryValues.discount_type) errors.discount_type = "Discount type is required.";
        if (!mandatoryValues.discount_value) errors.discount_value = "Discount value is required.";
        if (!mainCategory) errors.mainCategory = "Main Category is required.";
        if (!subCategory) errors.subCategory = "Sub Category is required.";
        if (!mandatoryValues.vendor) errors.vendor = "Vendor is required.";

        if (mandatoryValues.incoming < 0 || mandatoryValues.reserved < 0 || mandatoryValues.quantity < 0) {
            errors.incoming = "Stock value can't negative!!";
        }
        if (mandatoryValues.discount_value < 0) errors.discount_value = "Invalid Discount Value!!.";
        if (mandatoryValues.discount_type === 'percentage' && mandatoryValues.discount_value >= 100) {
            errors.discount_value = "Invalid Discount!!.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // ************************************ Post New Product ********************************************
    const handleAddProduct = async () => {
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
        try {
            await axios.post('http://localhost:7000/post/new/product', payload);
            setAddProductState(false);
            Admin_Api(dispatch);
        } catch (error) {
            console.error('Error adding product:', error);
            window.alert(error.message);
        }
    };

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
                                <input type='number' id='incoming' onChange={handleChange} min={1} />
                                {errors.incoming && <p className={style.error}>{errors.incoming}</p>}
                            </div>
                            <div>
                                <label htmlFor='reserved'><sup>*</sup>Reserved</label>
                                <input type='number' id='reserved' onChange={handleChange} min={1} />
                                {errors.reserved && <p className={style.error}>{errors.reserved}</p>}
                            </div>
                            <div>
                                <label htmlFor='quantity'><sup>*</sup>Quantity</label>
                                <input type='number' id='quantity' onChange={handleChange} min={1} />
                                {errors.quantity && <p className={style.error}>{errors.quantity}</p>}
                            </div>
                            <div>
                                <label htmlFor='price'><sup>*</sup>Price</label>
                                <input type='number' id='price' onChange={handleChange} min={0} />
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
                            <div id={style.vendor_select}>
                                <label htmlFor='discount_type'><sup>*</sup>Discount Type</label>
                                <select id='discount_type' onChange={handleChange}>
                                    <option value=''>Select Discount type...</option>
                                    {['percentage', 'amount'].map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.discount_type && <p className={style.error}>{errors.discount_type}</p>}
                            </div>
                            <div>
                                <label htmlFor='discount_value'><sup>*</sup>Discount Value</label>
                                <input type='number' id='discount_value' onChange={handleChange} min={0} />
                                {errors.discount_value && <p className={style.error}>{errors.discount_value}</p>}
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
}
)

export default AddProducts;
