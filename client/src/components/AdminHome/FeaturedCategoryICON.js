import React, { useContext, useEffect, useState, useCallback } from 'react';
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
  const [serialNoState, setSerialNoState] = useState(0);

  useEffect(() => {
    const featuredImagesIcon = dataState?.Setting_Page?.featured_category_icon || [];
    setFeaturedImages(prev => ({
      ...prev,
      currentImages: featuredImagesIcon
    }));

    const serialNos = featuredImagesIcon.map(item => item.serial_no);
    if (serialNos.length > 0) {
      setSerialNoState(Math.max(...serialNos));
    }
  }, [dataState]);

  const handleSaveText = useCallback(() => {
    setSaveText('Changes are Updated!');
    setTimeout(() => setSaveText(''), 2500);
  }, []);

  const handleSaveImage = useCallback(async () => {
    try {
      await axios.post('http://localhost:7000/featured/images/crud', {
        currentImages: featuredImages.currentImages,
        deleteImages: featuredImages.deleteImages,
        addNewImages: featuredImages.addNewImages
      });
      setFeaturedImages(prev => ({
        ...prev,
        addNewImages: [],
        deleteImages: []
      }));
      await Api_Setting(dispatch);
      handleSaveText();
    } catch (error) {
      console.error(error);
    }
  }, [featuredImages, handleSaveText, dispatch]);

  const handleAddNew = useCallback(() => {
    setFeaturedImages(prev => ({
      ...prev,
      addNewImages: [
        ...prev.addNewImages,
        { icon_no: null, icon: null, main_category: null, serial_no: serialNoState + 1 }
      ]
    }));
    setSerialNoState(prev => prev + 1);
  }, [serialNoState]);

  const handleUpdateImages = useCallback((e, index, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const mimeType = file.type;
        const base64WithMimeType = `data:${mimeType};base64,${base64String}`;

        setFeaturedImages(prev => ({
          ...prev,
          [state === 'main' ? 'currentImages' : 'addNewImages']: prev[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
            i === index ? { ...item, icon: base64WithMimeType } : item
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdateMainCategory = useCallback((e, index, state) => {
    const main_category = e.target.value;
    setFeaturedImages(prev => ({
      ...prev,
      [state === 'main' ? 'currentImages' : 'addNewImages']: prev[state === 'main' ? 'currentImages' : 'addNewImages'].map((item, i) =>
        i === index ? { ...item, main_category } : item
      )
    }));
  }, []);

  const handleCheckSerial = useCallback((e, index, state, current_serial) => {
    const isChecked = e.target.checked;
    const newSerialNo = isChecked ? serialNoState + 1 : 0;

    setSerialNoState(prev => isChecked ? prev + 1 : prev - 1);

    setFeaturedImages(prev => ({
      ...prev,
      [state === 'currentImages' ? 'currentImages' : 'addNewImages']: prev[state === 'currentImages' ? 'currentImages' : 'addNewImages'].map((item, i) =>
        i === index
          ? { ...item, serial_no: newSerialNo }
          : {
              ...item,
              serial_no: item.serial_no !== 0 && !isChecked
                ? current_serial < item.serial_no
                  ? item.serial_no - 1
                  : item.serial_no
                : item.serial_no
            }
      ),
      [state === 'currentImages' ? 'addNewImages' : 'currentImages']: prev[state === 'currentImages' ? 'addNewImages' : 'currentImages'].map(item =>
        item.serial_no !== 0
          ? { ...item, serial_no: item.serial_no !== 0 && !isChecked
              ? current_serial < item.serial_no
                ? item.serial_no - 1
                : item.serial_no
              : item.serial_no }
          : item
      )
    }));
  }, [serialNoState]);

  const handleDeleteImages = useCallback((icon_no, index, state, serial_no) => {
    if (serial_no !== 0) {
      handleCheckSerial({ target: { checked: false } }, -1, state, serial_no);
    }

    setFeaturedImages(prev => ({
      currentImages: state === 'main' ? prev.currentImages.filter(item => item.icon_no !== icon_no) : prev.currentImages,
      deleteImages: state === 'main' ? [...prev.deleteImages, Number(icon_no)] : prev.deleteImages,
      addNewImages: state !== 'main' ? prev.addNewImages.filter((_, i) => i !== index) : prev.addNewImages
    }));
  }, [handleCheckSerial]);

  return (
    <section className={styles.MainAddImages}>
      {/* Render current images */}
      {featuredImages.currentImages.map((item, i) => (
        <div className={styles.image_settings} key={`img-${i}`}>
          <img src={item.icon} alt={`img-${i}`} />
          <input type='file' id={`img-${i}`} onChange={e => handleUpdateImages(e, i, 'main')} />
          <select className={styles.select_dropdown} value={item.main_category || ''} onChange={e => handleUpdateMainCategory(e, i, 'main')}>
            <option value=''>select</option>
            {dataState.categoryName.map((option_value, i) => (
              <option key={i} value={option_value}>{GetCategoryName(option_value)}</option>
            ))}
          </select>
          <div className={styles.SerialNo}>
            <span>{item.serial_no}</span>
            <input type='checkbox' checked={item.serial_no !== 0} onChange={e => handleCheckSerial(e, i, 'currentImages', item.serial_no)} />
          </div>
          <button onClick={() => handleDeleteImages(item.icon_no, i, 'main', item.serial_no)}>Delete</button>
        </div>
      ))}

      {/* Render newly added images */}
      {featuredImages.addNewImages.map((item, i) => (
        <div className={styles.image_settings} key={`new-img-${i}`}>
          <img src={item.icon} alt={`new-img-${i}`} />
          <input type='file' id={`new-img-${i}`} onChange={e => handleUpdateImages(e, i, '')} />
          <select className={styles.select_dropdown} value={item.main_category || ''} onChange={e => handleUpdateMainCategory(e, i, '')}>
            <option value=''>select</option>
            {dataState.categoryName.map((option_value, i) => (
              <option key={i} value={option_value}>{GetCategoryName(option_value)}</option>
            ))}
          </select>
          <div className={styles.SerialNo}>
            <span>{item.serial_no}</span>
            <input type='checkbox' checked={item.serial_no !== 0} onChange={e => handleCheckSerial(e, i, '', item.serial_no)} />
          </div>
          <button onClick={() => handleDeleteImages(null, i, '', item.serial_no)}>Delete</button>
        </div>
      ))}

      <button className={styles.img_button} id='delete-images' onClick={handleAddNew}>+ Add New</button>
      <button className={styles.img_button} id='save-images' onClick={handleSaveImage}>Save Changes</button>

      {saveText && <span className={styles.saveText}>{saveText}</span>}
    </section>
  );
};

export default React.memo(FeaturedCategoryICON);
