import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/AdvertisementImages.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import { Api_Setting } from '../../api/Api_Setting';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';

const FeaturedCategoryICON = () => {
  const { dataState, dispatch } = useContext(useData);

  const [featuredImages, setFeaturedImages] = useState({
    currentImages: [],
    deleteImages: [],
    addNewImages: []
  });
  const [saveText, setSaveText] = useState('');
  const [serial_noState, setSerial_no_State] = useState(0);

  // UseEffect to load images
  useEffect(() => {
    const featuredImagesIcon = dataState?.Setting_Page?.featured_category_icon || [];
    setFeaturedImages((prev) => ({
      ...prev,
      currentImages: featuredImagesIcon
    }));

    // Determine the highest serial number
    const serialNos = featuredImagesIcon.map((item) => item.serial_no);
    if (serialNos.length > 0) {
      setSerial_no_State(Math.max(...serialNos));
    }

  }, [dataState, setFeaturedImages]);
  //* ---------------- handleSaveText ------------------
  const handleSaveText = () => {
    setSaveText('Changes are Updated!')
    setTimeout(() => {
      setSaveText('');
    }, 2500);
  };

  // Handle Save
  const handleSaveImage = async () => {
    try {
      await axios.post('http://localhost:7000/featured/images/crud', {
        currentImages: featuredImages.currentImages,
        deleteImages: featuredImages.deleteImages,
        addNewImages: featuredImages.addNewImages
      });
      setFeaturedImages((prev) => ({
        ...prev,
        addNewImages: [],
        deleteImages: []
      }));
      await Api_Setting(dispatch);

      handleSaveText();
    } catch (error) {
      console.log(error);
    }
  };

  // Add new image
  const handleAddNew = () => {
    setFeaturedImages((prev) => ({
      ...prev,
      addNewImages: [...prev.addNewImages, { icon_no: null, icon: null, main_category: null, serial_no: 0 }]
    }));

  };

  // Update image
  const handleUpdateImages = (e, index, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const mimeType = file.type;
        const base64WithMimeType = `data:${mimeType};base64,${base64String.split(',')[1]}`;

        setFeaturedImages((prevState) => ({
          ...prevState,
          [state === 'main' ? 'currentImages' : 'addNewImages']: prevState[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
            i === index ? { ...item, icon: base64WithMimeType } : item
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update position
  const handleUpdateMainCategory = (e, index, state) => {
    const main_category = e.target.value;
    setFeaturedImages((prev) => ({
      ...prev,
      [state === 'main' ? 'currentImages' : 'addNewImages']: prev[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
        i === index ? { ...item, main_category: main_category } : item
      )
    }));
  };


  // Handle checkbox state for serial number control
  const handleCheckSerial = (e, index, state, current_serial) => {
    const isChecked = e ? e.target.checked : false;

    setSerial_no_State((prev) => isChecked ? prev + 1 : prev - 1);

    const newSerialNo = isChecked ? serial_noState + 1 : 0;

    const imagesKey = state === 'currentImages' ? 'currentImages' : 'addNewImages';
    const oppositeKey = state === 'currentImages' ? 'addNewImages' : 'currentImages';

    setFeaturedImages((prev) => ({
      ...prev,
      [imagesKey]: prev[imagesKey].map((item, i) =>
        i === index
          ? { ...item, serial_no: newSerialNo }
          : {
            ...item,
            serial_no: item.serial_no !== 0 && !isChecked ? current_serial < item.serial_no ? item.serial_no - 1 : item.serial_no : item.serial_no
          }
      ),
      [oppositeKey]: prev[oppositeKey].map((item) =>
        item.serial_no !== 0
          ? { ...item, serial_no: item.serial_no !== 0 && !isChecked ? item.serial_no - 1 : item.serial_no }
          : item
      )
    }));

    console.log('Checkbox checked:', isChecked, 'New serial number:', newSerialNo);
  };

  // Delete image
  const handleDeleteImages = (icon_no, index, state, serial_no) => {
    serial_no !== 0 && handleCheckSerial('', -1, state, serial_no);

    setFeaturedImages((prev) => ({
      currentImages: state === 'main' ? prev.currentImages.filter((item) => item.icon_no !== icon_no) : prev.currentImages,
      deleteImages: state === 'main' ? [...prev.deleteImages, Number(icon_no)] : prev.deleteImages,
      addNewImages: state !== 'main' ? prev.addNewImages.filter((item, i) => i !== index) : prev.addNewImages
    }));

  };


  useEffect(() => {
    console.log('Updated serial_noState:', serial_noState);
  }, [serial_noState]);


  return (
    <section className={styles.MainAddImages}>
      {/* Render current images */}
      {featuredImages.currentImages?.length > 0 && featuredImages.currentImages.map((item, i) => (
        <div className={styles.image_settings} key={`img-${i}`}>
          <img src={item.icon} alt={`img-${i}`} />
          <input type='file' id={`img-${i}`} onChange={(e) => handleUpdateImages(e, i, 'main')} />
          <select className={styles.select_dropdown} value={item.main_category || ''} onChange={(e) => handleUpdateMainCategory(e, i, 'main')}>
            <option value=''>select</option>
            {dataState.categoryName.map((option_value, i) => (
              <option key={i} value={option_value}>{GetCategoryName(option_value)}</option>
            ))}
          </select>
          <div className={styles.SerialNo}>
            <span>{item.serial_no}</span>
            <input type='checkbox' checked={item.serial_no !== 0} onChange={(e) => handleCheckSerial(e, i, 'currentImages', item.serial_no)} />
          </div>
          <button onClick={() => handleDeleteImages(item.icon_no, i, 'main', item.serial_no)}>Delete</button>
        </div>
      ))}

      {/* Render newly added images */}
      {featuredImages.addNewImages?.length > 0 && featuredImages.addNewImages.map((item, i) => (
        <div className={styles.image_settings} key={`new-img-${i}`}>
          <img src={item.icon} alt={`new-img-${i}`} />
          <input type='file' id={`new-img-${i}`} onChange={(e) => handleUpdateImages(e, i, '')} />
          <select className={styles.select_dropdown} value={item.main_category || ''} onChange={(e) => handleUpdateMainCategory(e, i, '')}>
            <option value=''>select</option>
            {dataState.categoryName.map((option_value, i) => (
              <option key={i} value={option_value}>{GetCategoryName(option_value)}</option>
            ))}
          </select>
          <div className={styles.SerialNo}>
            <span>{item.serial_no}</span>
            <input type='checkbox' checked={item.serial_no !== 0} onChange={(e) => handleCheckSerial(e, i, '', item.serial_no)} />
          </div>
          <button onClick={() => handleDeleteImages(null, i, '', item.serial_no)}>Delete</button>
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

export default FeaturedCategoryICON;
