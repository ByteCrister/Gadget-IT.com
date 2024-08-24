import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/AdvertisementImages.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';

import { Api_Setting } from '../../api/Api_Setting';

const AdvertisementImages = () => {
    const { dataState, dispatch } = useContext(useData);

    const [imageStates, setImageStates] = useState({
        currentImages: [],
        deleteImages: [],
        addNewImages: []
    });

    const [saveText, setSaveText] = useState('');

    useEffect(() => {
        const advertisementImages = dataState?.Setting_Page?.advertisement_img || [];

        setImageStates((prev) => ({
            ...prev,
            currentImages: advertisementImages
        }));
    }, [dataState]);

    //* ---------------- handleSaveText ------------------
    const handleSaveText = () => {
        setSaveText('Changes are Updated!')
        setTimeout(() => {
            setSaveText('');
        }, 2500);
    };

    //* -------------------------- handleSaveImage -----------------------------
    const handleSaveImage = async () => {
        try {
            await axios.post('http://localhost:7000/advertisement/images', {
                currentImages: imageStates.currentImages,
                deleteImages: imageStates.deleteImages,
                addNewImages: imageStates.addNewImages
            });
            setImageStates((prev) => (
                {
                    ...prev,
                    addNewImages: [],
                    deleteImages: []
                }
            ))

            await Api_Setting(dispatch);
            handleSaveText()

        } catch (error) {
            console.log(error);
        }
    }


    // *----------------------- handleAddNew --------------------
    const handleAddNew = () => {
        setImageStates((prev) => ({
            ...prev,
            addNewImages: [...prev.addNewImages, { img_no: null, img: null, position: null, serial_no: null }]
        }));
    };


    // * ---------------------- handleUpdateImages -----------------
    const handleUpdateImages = (e, index, keyState) => {

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const mimeType = file.type;
                const base64WithMimeType = `data:${mimeType};base64,${base64String.split(',')[1]}`;

                setImageStates((prevState) => ({
                    ...prevState,
                    [keyState]: prevState[keyState].map((item, i) => i === index ? { ...item, img: base64WithMimeType } : item)
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    // * -------------------------------- handleUpdatePosition -----------------------------
    const handleUpdatePosition = (e, index, state) => {
        const newPosition = e.target.value;

        setImageStates((prev) => ({
            ...prev,
            [state === 'main' ? 'currentImages' : 'addNewImages']: prev[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
                i === index ? { ...item, position: newPosition } : item
            )
        }));
    };



    // * ---------------------------- handleDeleteImages ----------------------------
    const handleDeleteImages = (img_no, index, state) => {
        setImageStates((prev) => (
            {
                currentImages: state === 'main' ? prev.currentImages.filter((item) => item.img_no !== img_no) : prev.currentImages,
                deleteImages: state === 'main' ? [...prev.deleteImages, Number(img_no)] : prev.deleteImages,
                addNewImages: state !== 'main' ? prev.addNewImages.filter((item, i) => i !== index) : prev.addNewImages
            }
        ))

    };

    return (
        <section className={styles.MainAddImages}>
            {/* Render current images */}
            {imageStates.currentImages?.length > 0 && imageStates.currentImages.map((item, i) => (
                <div className={styles.image_settings} key={`img-${i}`}>
                    <img src={item.img} alt={`img-${i}`} />
                    <input type='file' id={`img-${i}`} onChange={(e) => handleUpdateImages(e, i, 'currentImages')} />
                    <select className={styles.select_dropdown} value={item.position || ''} onChange={(e) => handleUpdatePosition(e, i, 'main')}>
                        <option value=''>select</option>
                        <option value='main' selected={'main' === item.position}>Main</option>
                        <option value='sub' selected={'sub' === item.position}>Sub</option>
                        <option value='offers' selected={'offers' === item.position}>Offers</option>
                        <option value='incoming' selected={'incoming' === item.position}>Incoming</option>
                    </select>
                    <button onClick={() => handleDeleteImages(item.img_no, i, 'main')}>Delete</button>
                </div>
            ))}

            {/* Render newly added images */}
            {imageStates.addNewImages?.length > 0 && imageStates.addNewImages.map((item, i) => (
                <div className={styles.image_settings} key={`new-img-${i}`}>
                    <img src={item.img} alt={`new-img-${i}`} />
                    <input type='file' id={`new-img-${i}`} onChange={(e) => handleUpdateImages(e, i, 'addNewImages')} />
                    <select className={styles.select_dropdown} value={item.position || ''} onChange={(e) => handleUpdatePosition(e, i, '')}>
                        <option value=''>select</option>
                        <option value='main'>Main</option>
                        <option value='sub'>Sub</option>
                        <option value='offers'>Offers</option>
                        <option value='incoming'>Incoming</option>
                    </select>
                    <button onClick={() => handleDeleteImages('', i, '')}>Delete</button>
                </div>
            ))}

            <button className={styles.img_button} id='delete-images' onClick={handleAddNew}>+ Add New</button>
            <button className={styles.img_button} id='save-images' onClick={handleSaveImage}>Save Changes</button>

            {
                saveText.length !== 0 &&
                <span className={styles.saveText}>{saveText}</span>
            }
        </section>
    );
};

export default AdvertisementImages;