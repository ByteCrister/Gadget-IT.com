import React, { useCallback, useEffect, useMemo, useState } from 'react'

import styles from '../../styles/AdminHome/ManageVendors.module.css';
import axios from 'axios';

const ManageVendors = () => {
    const [Vendors, setVendors] = useState([]);
    const [vendorState, setVendorState] = useState({
        newName: '',
        selectedVendor: '',
        vendorNo: null,
        buttonState: 1
    });

    const vendor_Api = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-vendors`);  //* to ---> product.outer.router
            setVendors(await response.data);

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        vendor_Api();
    }, []);

    // * Reset all states
    const reset = () => {
        setVendorState({
            newName: '',
            selectedVendor: '',
            vendorNo: null,
            buttonState: 1
        });
    };


    // * name validation
    const isValid = () => {
        if (vendorState.newName.trim().length === 0 || vendorState.newName.trim().length <= 3) {
            window.alert('Please give a valid vendor name. It should be at least 3 length.');
            return false;
        } else if (Vendors.some((item) => item.vendor_name.toLowerCase() === vendorState.newName.toLowerCase())) {
            window.alert('The given name is already exist.');
            return false;
        } else
            return true;
    };

    // ********* CRUD API's **********

    // * Crete Api *
    const vendor_Create_Api = async () => {
        if (isValid()) {
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/insert-new-vendor`, {
                    vendor_name: vendorState.newName
                });
                window.alert('Vendor name added successfully.');
                await vendor_Api();
                reset();
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    // * Update Api 
    const vendor_update_Api = async () => {
        if (isValid()) {
            try {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-vendor`, {
                    new_vendor_name: vendorState.newName,
                    vendor_no: vendorState.vendorNo
                });
                window.alert('Vendor name updated successfully.');
                await vendor_Api();
                reset();
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    // * Delete Api 
    const vendor_delete_Api = async () => {
        if (window.confirm('Do you want to delete this vendor?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-vendor/${vendorState.vendorNo}`);
                window.alert('Vendor deleted successfully.');
                await vendor_Api();
                reset();
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    const handleButtonState = useCallback((newState) => {
        setVendorState(prev => ({
            ...prev,
            buttonState: newState
        }));
    }, []);


    const handleVendorSelect = useCallback((e) => {
        setVendorState(prev => ({
            ...prev,
            selectedVendor: e.target.value,
            vendorNo: Vendors.find(item => item.vendor_name === e.target.value).vendor_no || null
        }));
    }, [Vendors]);

    const handleVendorNameChange = (e) => {
        setVendorState(prev => ({
            ...prev,
            newName: e.target.value
        }));
    };


    const renderVendorSelectOption = useMemo(() => {
        return (<div className={styles['vendor-select']}>
            <select value={vendorState.selectedVendor} onChange={handleVendorSelect}>
                {
                    Vendors.map((item, index) => {
                        return <option key={index} value={item.vendor_name}>
                            {item.vendor_name}
                        </option>
                    })
                }
            </select>
        </div>);
    }, [Vendors, vendorState.selectedVendor, handleVendorSelect]);



    // * Create vendor *
    const createVendor = () => {
        return (<div className={styles['create-section']}>
            <input type='text' value={vendorState.newName} onChange={handleVendorNameChange} placeholder='name'></input>
            {vendorState.buttonState === 1 && <button className={styles['vendor-buttons']} onClick={vendor_Create_Api}>Create</button>}
        </div>)
    };


    // * Update vendor *
    const updateVendor = () => {
        return (<div className={styles['update-section']}>
            {renderVendorSelectOption}
            {createVendor()}
            <button className={styles['vendor-buttons']} onClick={vendor_update_Api}>Update</button>
        </div>)
    };


    // * Delete vendor *
    const deleteVendor = () => {
        return (<div className={styles['delete-section']}>
            {renderVendorSelectOption}
            <button className={styles['vendor-buttons']} onClick={vendor_delete_Api}>Delete</button>
        </div>)
    };

    return (
        <section className={styles['manage-vendor-outer-section']}>
            <div className={styles['manage-vendor-outer-section-buttons']}>
                <button onClick={() => handleButtonState(1)}>Create</button>
                <button onClick={() => handleButtonState(2)}>Update</button>
                <button onClick={() => handleButtonState(3)}>Delete</button>
            </div>
            <span className={styles['manage-report-outer-section-span']}>{vendorState.buttonState === 1 ? 'Create Vendor' : vendorState.buttonState === 2 ? 'Update Vendor' : 'Delete Vendor'}</span>
            {vendorState.buttonState === 1 ? createVendor() : vendorState.buttonState === 2 ? updateVendor() : deleteVendor()}
        </section>
    );
};

export default React.memo(ManageVendors);