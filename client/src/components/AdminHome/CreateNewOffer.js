import React, { useContext, useEffect, useRef, useState } from 'react'

import styles from '../../styles/AdminHome/ManageOffers.module.css'
import { FaSearch } from 'react-icons/fa'
import { useData } from '../../context/useData'
import Pagination from '../../HOOKS/Pagination'
import axios from 'axios'
import { SearchOffers } from '../../HOOKS/SearchOffers'
import { DisplayBangladeshTime } from '../../HOOKS/DisplayBangladeshTime'

const CreateNewOffer = () => {
    const { dataState, dispatch } = useContext(useData);

    const [offerCarts, setOfferCarts] = useState({
        MainOfferCarts: [],
        filteredOfferCarts: []
    });

    const [formState, setFormState] = useState(false);
    const [formFillUp, setFormFillUp] = useState({
        cart_title: '',
        cart_description: '',
        cart_image: '',
        offer_start: null,
        offer_end: null
    });
    const [formErrorState, setFormErrorState] = useState({
        isError: false,
        errorMessage: ''
    });

    const [formUpdateState, setUpdateFormState] = useState(false);
    const [formUpdateFillUp, setUpdateFormFillUp] = useState({
        cart_no: null,
        cart_title: '',
        cart_description: '',
        cart_image: '',
        offer_start: null,
        offer_end: null
    });
    const [formUpdateErrorState, setFormUpdateErrorState] = useState({
        isError: false,
        errorMessage: ''
    });
    const searchRef = useRef();

    useEffect(() => {
        if (dataState?.Setting_Page && dataState?.Setting_Page?.offer_carts) {
            setOfferCarts({
                MainOfferCarts: [...dataState.Setting_Page.offer_carts],
                filteredOfferCarts: [...dataState.Setting_Page.offer_carts]
            });
            dispatch({
                type: 'set_search_function',
                payload: {
                    function: SearchOffers,
                    params: {
                        p_1: offerCarts,
                        p_2: dataState.Setting_Page.offer_carts,
                        p_3: setOfferCarts
                    }
                }
            })
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataState.Setting_Page]);

    const handleFilteredData = (data) => {
        setOfferCarts((prev) => ({
            ...prev,
            filteredOfferCarts: data
        }));
    };

    const handleSearch = () => {
        SearchOffers(searchRef.current.value, offerCarts, dataState.Setting_Page.offer_carts, setOfferCarts);
    };

    const handleFormChange = (e) => {

        const { id, type, files, value } = e.target;
        if (type === 'file') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64WithMimeType = reader.result;

                setFormFillUp((prevState) => ({
                    ...prevState,
                    [id]: base64WithMimeType
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormFillUp((prev) => ({
                ...prev,
                [id]: value
            }));
        }

    };

    const handleFormUpdateChange = (e) => {
        const { id, type, files, value } = e.target;
        if (type === 'file') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64WithMimeType = reader.result;

                setUpdateFormFillUp((prevState) => ({
                    ...prevState,
                    [id]: base64WithMimeType
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setUpdateFormFillUp((prev) => ({
                ...prev,
                [id]: value
            }));
        }

    };

    const isValidateUpdate = () => {
        setFormUpdateErrorState({
            isError: false,
            errorMessage: ''
        });

        if (!formUpdateFillUp.cart_title || !formUpdateFillUp.cart_description || !formUpdateFillUp.cart_image || !formUpdateFillUp.offer_start || !formUpdateFillUp.offer_end) {
            setFormUpdateErrorState({
                isError: true,
                errorMessage: 'All fields are required. Please fill in the missing information.'
            });
            return false;
        }

        if (new Date(formUpdateFillUp.offer_end) < new Date(formUpdateFillUp.offer_start)) {
            setFormUpdateErrorState({
                isError: true,
                errorMessage: 'The offer end date cannot be earlier than the start date.'
            });
            return false;
        }

        return true;

    };

    const isValidate = () => {
        setFormErrorState({
            isError: false,
            errorMessage: ''
        });

        if (!formFillUp.cart_title || !formFillUp.cart_description || !formFillUp.cart_image || !formFillUp.offer_start || !formFillUp.offer_end) {
            setFormErrorState({
                isError: true,
                errorMessage: 'All fields are required. Please fill in the missing information.'
            });
            return false;
        }

        if (new Date(formFillUp.offer_end) < new Date(formFillUp.offer_start)) {
            setFormErrorState({
                isError: true,
                errorMessage: 'The offer end date cannot be earlier than the start date.'
            });
            return false;
        }
        return true;
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        if (isValidate()) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-new-offer`, { formFillUp });
                dispatch({ type: 'set_new_offer_carts', payload: res.data });
                setFormState(false);
                const updatedFormFillUp = {};
                Object.entries(formFillUp).forEach(([key, value]) => ({
                    ...updatedFormFillUp,
                    [key]: ''
                }));
                setFormFillUp(updatedFormFillUp);
                setFormErrorState({ isError: false, errorMessage: '' });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleOfferUpdateSubmit = async (e) => {
        e.preventDefault();
        if (isValidateUpdate()) {
            try {
                const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-offer-cart`, { formUpdateFillUp });
                dispatch({ type: 'set_new_offer_carts', payload: res.data });
                setUpdateFormState(false);
                const updatedFormFillUp = {};
                Object.entries(formUpdateFillUp).forEach(([key, value]) => ({
                    ...updatedFormFillUp,
                    [key]: ''
                }));
                setUpdateFormFillUp(updatedFormFillUp);
                setFormUpdateErrorState({ isError: false, errorMessage: '' });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleInitialUpdateForm = (offer) => {
        Object.entries(offer).forEach(([key, value]) => {
            setUpdateFormFillUp((prev) => ({
                ...prev,
                [key]: value
            }));
        });
        setUpdateFormState(true);
    };


    const handleDelete = async (cart_no) => {
        if (window.confirm('Do you want to delete this cart?')) {
            try {
                const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-offer-cart/${cart_no}`);
                dispatch({ type: 'set_new_offer_carts', payload: res.data });
                setUpdateFormState(false);
                const updatedFormFillUp = {};
                Object.entries(formUpdateFillUp).forEach(([key, value]) => ({
                    ...updatedFormFillUp,
                    [key]: ''
                }));
                setUpdateFormFillUp(updatedFormFillUp);
                setFormUpdateErrorState({ isError: false, errorMessage: '' });
            } catch (error) {
                console.log(error);
            }
        }
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
                <button onClick={() => setFormState((prev) => !prev)}>Create New Offer</button>
            </section>

            <section className={styles.CreateOfferTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th>Cart no.</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            offerCarts &&
                            offerCarts.filteredOfferCarts &&
                            offerCarts.filteredOfferCarts.map((offer) => {
                                return <tr key={offer.cart_no} onClick={() => handleInitialUpdateForm(offer)}>
                                    <td>{offer.cart_no}</td>
                                    <td><div className={styles.ImgOfferTr}><img src={offer.cart_image} alt={offer.cart_title}></img></div></td>
                                    <td>{offer.cart_title.length > 10 ? offer.cart_title.slice(0, 20) + '...' : offer.cart_title}</td>
                                    <td>{offer.cart_description.length > 10 ? offer.cart_description.slice(0, 20) + '...' : offer.cart_description}</td>
                                    <td>{DisplayBangladeshTime(offer.offer_start)}</td>
                                    <td>{DisplayBangladeshTime(offer.offer_end)}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>

                {
                    formState &&
                    <section className={styles.CreateOfferForm}>
                        <span>{formErrorState.isError ? '***' + formErrorState.errorMessage + '***' : 'Create New Offer'}</span>
                        <form onSubmit={handleOfferSubmit}>
                            <input type='text' id='cart_title' value={formFillUp.cart_title} placeholder='title' onChange={handleFormChange}></input>
                            <input type='text' id='cart_description' value={formFillUp.cart_description} placeholder='description' onChange={handleFormChange}></input>
                            <input type='file' id='cart_image' onChange={handleFormChange}></input>
                            <input type='date' id='offer_start' value={formFillUp.offer_start} onChange={handleFormChange}></input>
                            <input type='date' id='offer_end' value={formFillUp.offer_end} onChange={handleFormChange}></input>
                            <div>
                                <button type='submit'>Add New Offer</button>
                                <button onClick={() => setFormState(false)}>Back</button>
                            </div>
                        </form>
                    </section>
                }
                {
                    formUpdateState &&
                    <section className={styles.UpdateOfferForm}>
                        <span>{formUpdateErrorState.isError ? '***' + formUpdateErrorState.errorMessage + '***' : 'Update Offer'}</span>
                        <form onSubmit={handleOfferUpdateSubmit}>
                            <input type='text' id='cart_title' value={formUpdateFillUp.cart_title} placeholder='title' onChange={handleFormUpdateChange}></input>
                            <input type='text' id='cart_description' value={formUpdateFillUp.cart_description} placeholder='description' onChange={handleFormUpdateChange}></input>
                            <input type='file' id='cart_image' onChange={handleFormUpdateChange}></input>
                            <input type='date' id='offer_start' value={formUpdateFillUp.offer_start} onChange={handleFormUpdateChange}></input>
                            <input type='date' id='offer_end' value={formUpdateFillUp.offer_end} onChange={handleFormUpdateChange}></input>
                            <div>
                                <button type='submit'>Update</button>
                                <button onClick={() => handleDelete(formUpdateFillUp.cart_no)}>Delete</button>
                                <button onClick={() => setUpdateFormState(false)}>Back</button>
                            </div>
                        </form>
                    </section>
                }

            </section>
            <Pagination productsData={offerCarts.MainOfferCarts} handleFilteredData={handleFilteredData} />
        </section>
    )
}

export default React.memo(CreateNewOffer);