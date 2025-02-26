import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from '../../styles/AdminHome/AdvertisementImages.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import { Api_Setting } from '../../api/Api_Setting';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';

const FeaturedCategoryICON = () => {
  const { dataState, dispatch } = useContext(useData);

  const [featuredImages, setFeaturedImages] = useState([]);
  const [saveText, setSaveText] = useState('');
  const [serialNoState, setSerialNoState] = useState(0);
  const [indexState, setIndexState] = useState(0);

  useEffect(() => {
    let featuredImagesIcon = dataState?.Setting_Page?.featured_category_icon || [];
    featuredImagesIcon = featuredImagesIcon.map((item, index) => ({ ...item, index: index }));
    setFeaturedImages(featuredImagesIcon);

    const serialNos = featuredImagesIcon.map(item => item.serial_no);
    console.log(serialNos);
    if (serialNos.length > 0) {
      setSerialNoState(Math.max(...serialNos));
    }
    setIndexState(featuredImagesIcon && featuredImagesIcon.length > 0 ? Math.max(...featuredImagesIcon.map(item => item.index)) : 0);

  }, [dataState?.Setting_Page?.featured_category_icon]);

  const handleSaveText = useCallback(() => {
    setSaveText('Changes are Updated!');
    setTimeout(() => setSaveText(''), 2500);
  }, []);

  const handleSaveImage = useCallback(async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/featured/images/crud`, {
        featuredImages
      });
      // setFeaturedImages([]);
      await Api_Setting(dispatch);
      handleSaveText();
    } catch (error) {
      console.error(error);
    }
  }, [featuredImages, dispatch, handleSaveText]);


  const getCurrentSerial = (index) => {
    const IconNO = featuredImages.find((item) => item.index === index);
    return IconNO ? IconNO.serial_no : 0;
  };

  const haveCategory = useCallback((index) => {
    return featuredImages.some((item) => item.index === index && item.main_category && item.main_category.length !== 0);
  }, [featuredImages]);

  const handleAddNew = useCallback(() => {
    // -1 for newly inserted icons
    setFeaturedImages(prev => [...prev, { icon_no: -1, index: indexState + 1, icon: null, main_category: '', serial_no: 0 }]);
    setIndexState((prev) => prev + 1);
  }, [indexState]);

  const handleUpdateImages = useCallback((e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const mimeType = file.type;
        const base64WithMimeType = `data:${mimeType};base64,${base64String}`;

        setFeaturedImages(prev =>
          [...prev.map((item) => {
            return item.index === index ? { ...item, icon: base64WithMimeType } : item
          })]
        );
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdateMainCategory = (e, index) => {
    const main_category = e.target.value;
    const currSerial = getCurrentSerial(index);
    console.log('Main category: ' + main_category + ' - currSerial: ' + currSerial);
    if (main_category && main_category.length !== 0) {
      setFeaturedImages(prev =>
        [...prev.map((item) => item.index === index ? { ...item, main_category: main_category } : item)]);
    } else {
      setFeaturedImages(prev =>
        [...prev.map((item) => item.index === index ? { ...item, main_category: '', serial_no: 0 } : { ...item, serial_no: currSerial !== 0 && currSerial < item.serial_no ? item.serial_no - 1 : item.serial_no })]);
    }
  };

  const handleCheckSerial = useCallback((e, index, serial_no) => {
    console.log(serialNoState);
    const isChecked = e.target.checked;
    console.log('index: ' + index + ' - serial: ' + serial_no);
    if (isChecked && haveCategory(index)) {
      setFeaturedImages(prev =>
        [...prev.map((item) => item.index === index ? { ...item, serial_no: serialNoState + 1 } : item)]);
      setSerialNoState(prev => prev + 1);
    } else {
      setFeaturedImages(prev =>
        [...prev.map((item) => item.index === index ? { ...item, serial_no: 0 } : { ...item, serial_no: serial_no !== 0 && serial_no < item.serial_no ? item.serial_no - 1 : item.serial_no })]);
      setSerialNoState(prev => serial_no !== 0 ? prev - 1 : prev);
    }

  }, [haveCategory, serialNoState]);

  const handleDeleteImages = useCallback((index, serial_no) => {
    setFeaturedImages(prev =>
      [...prev.filter((item) => {
        return item.index !== index
      }).map((item) => {
        return { ...item, serial_no: serial_no !== 0 && serial_no < item.serial_no ? item.serial_no - 1 : item.serial_no }
      })
      ]);
    setSerialNoState((prev) => serial_no !== 0 ? prev - 1 : prev);

  }, []);

  return (
    <section className={styles.MainAddImages}>
      {/* Render current images */}
      {featuredImages.map((item, i) => (
        <div className={styles.image_settings} key={`img-${i}`}>
          <img src={item.icon} alt={`img-${i}`} />
          <input type='file' id={`img-${i}`} onChange={e => handleUpdateImages(e, item.index)} />
          <select className={styles.select_dropdown} value={item.main_category} onChange={e => handleUpdateMainCategory(e, item.index)}>
            <option value=''>select</option>
            {dataState.categoryName.map((option_value, i) => (
              <option key={i} value={option_value}>{GetCategoryName(option_value)}</option>
            ))}
          </select>
          <div className={styles.SerialNo}>
            <span>{item.serial_no}</span>
            <input type='checkbox' checked={item.serial_no !== 0} onChange={e => handleCheckSerial(e, item.index, item.serial_no)} />
          </div>
          <button onClick={() => handleDeleteImages(item.index, item.serial_no)}>Delete</button>
        </div>
      ))}


      <button className={styles.img_button} id='delete-images' onClick={handleAddNew}>+ Add New</button>
      <button className={styles.img_button} id='save-images' onClick={handleSaveImage}>Save Changes</button>

      {saveText && <span className={styles.saveText}>{saveText}</span>}
    </section>
  );
};

export default React.memo(FeaturedCategoryICON);
