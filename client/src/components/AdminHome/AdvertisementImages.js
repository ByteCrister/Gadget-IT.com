import React, { useContext, useEffect, useState, useCallback } from 'react';
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
        setImageStates(prev => ({
            ...prev,
            currentImages: advertisementImages
        }));
    }, [dataState]);

    const handleSaveText = useCallback(() => {
        setSaveText('Changes are Updated!');
        setTimeout(() => setSaveText(''), 2500);
    }, []);

    const handleSaveImage = useCallback(async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/advertisement/images`, {
                currentImages: imageStates.currentImages,
                deleteImages: imageStates.deleteImages,
                addNewImages: imageStates.addNewImages
            });

            setImageStates(prev => ({
                ...prev,
                addNewImages: [],
                deleteImages: []
            }));

            await Api_Setting(dispatch);
            handleSaveText();

        } catch (error) {
            console.error(error);
        }
    }, [imageStates, dispatch, handleSaveText]);

    const handleAddNew = useCallback(() => {
        setImageStates(prev => ({
            ...prev,
            addNewImages: [...prev.addNewImages, { img_no: null, img: null, position: null, serial_no: null }]
        }));
    }, []);

    const handleUpdateImages = useCallback((e, index, keyState) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                const mimeType = file.type;
                const base64WithMimeType = `data:${mimeType};base64,${base64String}`;

                setImageStates(prevState => ({
                    ...prevState,
                    [keyState]: prevState[keyState].map((item, i) =>
                        i === index ? { ...item, img: base64WithMimeType } : item
                    )
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleUpdatePosition = useCallback((e, index, state) => {
        const newPosition = e.target.value;

        setImageStates(prev => ({
            ...prev,
            [state === 'main' ? 'currentImages' : 'addNewImages']: prev[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
                i === index ? { ...item, position: newPosition } : item
            )
        }));
    }, []);

    const handleDeleteImages = useCallback((img_no, index, state) => {
        setImageStates(prev => ({
            currentImages: state === 'main' ? prev.currentImages.filter(item => item.img_no !== img_no) : prev.currentImages,
            deleteImages: state === 'main' ? [...prev.deleteImages, Number(img_no)] : prev.deleteImages,
            addNewImages: state !== 'main' ? prev.addNewImages.filter((_, i) => i !== index) : prev.addNewImages
        }));
    }, []);

    return (
        <section className={styles.MainAddImages}>
            {/* Render current images */}
            {imageStates.currentImages?.length > 0 && imageStates.currentImages.map((item, i) => (
                <div className={styles.image_settings} key={`img-${i}`}>
                    <img src={item.img} alt={`img-${i}`} />
                    <input
                        type='file'
                        id={`img-${i}`}
                        onChange={(e) => handleUpdateImages(e, i, 'currentImages')}
                    />
                    <select
                        className={styles.select_dropdown}
                        value={item.position || ''}
                        onChange={(e) => handleUpdatePosition(e, i, 'main')}
                    >
                        <option value=''>select</option>
                        <option value='main'>Main</option>
                        <option value='sub'>Sub</option>
                        <option value='offers'>Offers</option>
                        <option value='incoming'>Incoming</option>
                    </select>
                    <button onClick={() => handleDeleteImages(item.img_no, i, 'main')}>Delete</button>
                </div>
            ))}

            {/* Render newly added images */}
            {imageStates.addNewImages?.length > 0 && imageStates.addNewImages.map((item, i) => (
                <div className={styles.image_settings} key={`new-img-${i}`}>
                    <img src={item.img} alt={`new-img-${i}`} />
                    <input
                        type='file'
                        id={`new-img-${i}`}
                        onChange={(e) => handleUpdateImages(e, i, 'addNewImages')}
                    />
                    <select
                        className={styles.select_dropdown}
                        value={item.position || ''}
                        onChange={(e) => handleUpdatePosition(e, i, '')}
                    >
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

            {saveText.length !== 0 && <span className={styles.saveText}>{saveText}</span>}
        </section>
    );
};

export default React.memo(AdvertisementImages);
