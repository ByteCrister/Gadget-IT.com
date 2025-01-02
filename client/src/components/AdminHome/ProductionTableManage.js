import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/ProductionDetails.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import Admin_Api from '../../api/Admin_Api';

const ProductionTableManage = React.memo(({ id, category, setIsProductionManagement, setErrorCategory }) => {
  const { dataState, dispatch } = useContext(useData);

  const [mainTable, setMainTable] = useState(dataState.Production_Page.TableFullRows || []);

  const [newChanges, setNewChanges] = useState({ newAddedDes: [], DeletedDes: [], newAddedImg: [], DeletedImg: [] });

  const [MainTableEndIndex, setMainTableEndIndex] = useState([]);
  const [DesEndIndex, setDesEndIndex] = useState([]);
  const [ExtraImgEndIndex, setExtraImgEndIndex] = useState([]);
  const [tableColumns, setTableColumns] = useState({ TableColumns: [], Vendors: [] });
  const [subCategory, setSubCategory] = useState([]);

  // *--------------------- Filtering Products By ID -----------------------
  useEffect(() => {
    const initializeColumns = async () => {
      const filteredMainTable = dataState.Production_Page.TableFullRows.filter(item => item.product_id === id);
      const filteredDescriptionByID = dataState.Production_Page.descriptions.filter(item => item.product_id === id);
      const filteredExtraImagesByID = dataState.Production_Page.extraImages.filter(item => item.product_id === id);
      const filteredStockValuesByID = dataState.Production_Page.TableRows.filter(item => item.id === id);

      setMainTable(filteredMainTable);
      const subCategories = dataState.subCategoryName.filter(
        (values) => values.main_category_name === category
      ).map(item => item.sub_category_name);
      setSubCategory(subCategories);

      let states1 = [];
      if (filteredStockValuesByID.length > 0) {
        const stock = filteredStockValuesByID[0];
        states1.push({ column: 'incoming', value: stock.incoming });
        states1.push({ column: 'reserved', value: stock.reserved });
        states1.push({ column: 'quantity', value: stock.quantity });
        states1.push({ column: 'price', value: stock.price });
        try {
          if (filteredStockValuesByID.length > 0) {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/production/get/columns/${filteredStockValuesByID[0].type}`);
            setTableColumns({
              TableColumns: res.data.TableColumns,
              Vendors: res.data.Vendors
            });
            // console.log(JSON.stringify(tableColumns.Vendors, null, 2));
            // console.log(stock.vendor);
            // console.log(tableColumns.Vendors.find((item) => item.vendor_name === stock.vendor).vendor_no);
            states1.push({ column: 'vendor_no', value: res.data.Vendors.find((item) => item.vendor_name === stock.vendor).vendor_no || 0 });
          }
        } catch (error) {
          console.log(error);
        }



        filteredMainTable.forEach(item => {
          for (const key in item) {
            if (item.hasOwnProperty(key) && key !== 'product_id' && key !== 'hide' && key !== 'main_category' && key !== 'vendor_no' && key !== 'brand') {
              states1.push({ column: key, value: item[key], no: null });
            }
          }
        });
        // console.log(states1);
        setMainTableEndIndex(states1);
      }

      let states2 = [];
      filteredDescriptionByID.forEach(item => {
        states2.push({ column: item.head, value: item.head_value, no: item.description_no });
      });
      setDesEndIndex(states2);

      let states3 = [];
      filteredExtraImagesByID.forEach(item => {
        states3.push({ column: item, value: item.image, no: item.image_no });
      });
      setExtraImgEndIndex(states3);

      // console.log(JSON.stringify(filteredMainTable, null, 2));
    }

    initializeColumns();
  }, [id, dataState, category]);



  // *------------------------- Handle Update Information's -------------------------
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update/product`, {
        id: id,
        category: category,
        newChanges: newChanges,
        MainTableEndIndex: MainTableEndIndex,
        DesEndIndex: DesEndIndex,
        ExtraImgEndIndex: ExtraImgEndIndex
      });
      console.log('Product updated successfully');
      setIsProductionManagement(false);
      await Admin_Api(dispatch);

    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
    }
  };

  // --------------------------------------------------------------------------------


  // * Handler to convert file to base64 and include MIME type
  const handleImageFileChange = (e, index, state) => {
    const file = e.target.files[0];

    if (!file) return; // Handle case where no file is selected

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setErrorCategory({ isError: true, message: 'The file is not an Image! Please enter a valid Image file.' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE_KB = 50;
        const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9; // Start with high quality
        let compressedDataURL = canvas.toDataURL(file.type, quality);
        let compressedDataSize = (compressedDataURL.length * 3) / 4; // Base64 size approximation

        // Compress image until it's below the size limit
        while (compressedDataSize > MAX_SIZE_BYTES && quality > 0) {
          quality -= 0.05;
          compressedDataURL = canvas.toDataURL(file.type, quality);
          compressedDataSize = (compressedDataURL.length * 3) / 4;
        }

        // Final base64 string with MIME type
        const base64WithMimeType = `data:${file.type};base64,${compressedDataURL.split(',')[1]}`;

        // Update the appropriate state
        if (state === 'main') {
          setMainTableEndIndex(prevState =>
            prevState.map((item, i) => i === index ? { ...item, value: base64WithMimeType } : item)
          );
        } else if (state === 'extra') {
          setExtraImgEndIndex(prevState =>
            prevState.map((item, i) => i === index ? { ...item, value: base64WithMimeType } : item)
          );
        } else {
          setNewChanges(prev => ({
            ...prev,
            newAddedImg: prev.newAddedImg.map((item, i) => i === index ? { ...item, value: base64WithMimeType } : item)
          }));
        }
      };

      img.src = base64String;
    };

    reader.readAsDataURL(file);
  };

  //-----------------------------------------------------------------------------------------------


  // * --------------------------------- handle Main table change ----------------------------
  const handlerMainTableChange = (e, index) => {
    setMainTableEndIndex((prev) => prev.map((item, i) => i === index ? { ...item, value: e.target.value } : item))
  }
  // --------------------------------------------------------------------------------------------------


  //* ------------------------------------- handle description Change ---------------------------------
  const handleAddDes = () => {
    setNewChanges((prev) => ({ ...prev, newAddedDes: [...prev.newAddedDes, { column: '', value: '', no: '' }] }))
  }
  const handleDescriptionChange = (e, index, state, column) => {
    if (state === 'main') {
      if (column === 'head') {
        setDesEndIndex((prev) => prev.map((item, i) => i === index ? { ...item, column: e.target.value } : item))
      } else {
        setDesEndIndex((prev) => prev.map((item, i) => i === index ? { ...item, value: e.target.value } : item))
      }
    } else {
      if (column === 'head') {
        setNewChanges((prev) => ({
          ...prev,
          newAddedDes: prev.newAddedDes.map((item, i) => i === index ? { ...item, column: e.target.value } : item)
        }));
      } else {
        setNewChanges((prev) => ({
          ...prev,
          newAddedDes: prev.newAddedDes.map((item, i) => i === index ? { ...item, value: e.target.value } : item)
        }));
      }
    }
  }
  const handleDeleteDes = (index, prevDesNo, state) => {
    if (state === 'main') {
      setDesEndIndex((prev) => prev.filter((item, i) => i !== index));
      setNewChanges((prev) => ({
        ...prev,
        DeletedDes: [...prev.DeletedDes, Number(prevDesNo)]
      }));
    } else {
      setNewChanges((prev) => ({
        ...prev,
        newAddedDes: prev.newAddedDes.filter((item, i) => i !== index)
      }))
    }
  };
  // --------------------------------------------------------------------------------------------------


  //* ------------------------------------- handle extra image Change ---------------------------------
  const handleAddNewImg = () => {
    setNewChanges((prev) => ({ ...prev, newAddedImg: [...prev.newAddedImg, { column: '', value: null, no: '' }] }))
  }

  const handleDeleteImg = (index, prevImgNo, state) => {
    if (state === 'extra') {
      setExtraImgEndIndex((prev) => prev.filter((item, i) => i !== index));
      setNewChanges((prev) => ({
        ...prev,
        DeletedImg: [...prev.DeletedImg, Number(prevImgNo)]
      }))
    } else {
      setNewChanges((prev) => ({ ...prev, newAddedImg: prev.newAddedImg.filter((item, i) => i !== index) }))
    }
  };


  const getVendorName = (vendor_no) => {
    const Vendor = tableColumns.Vendors.find((item) => item.vendor_no === vendor_no);
    return Vendor.vendor_name || '';
  };


  // --------------------------------------------------------------------------------------------------


  return (
    <section className={styles.ProductTableManageMainContainer}>
      <div className={styles.ProductEntry}>

        {/* ***************************** Intro Information ********************************/}
        {mainTable.map((value) => (
          <div className={styles.ProductInfo} key={value.product_id}>
            <p className={styles.ProductDetail}>Product ID: {value.product_id}</p>
            <p className={styles.ProductDetail}>Name: {value.product_name}</p>
            <p className={styles.ProductDetail}>Category: {GetCategoryName(value.main_category)}</p>
          </div>
        ))}


        {/* ***************************** Product Stock Values ********************************/}
        <div className={styles.DigitNames}>
          {MainTableEndIndex.slice(0, 5).map((item, i) => (
            <div key={i} className={styles.DigitGroup}>
              <label htmlFor={`stock-product-${i}`} className={styles.DigitLabel}>
                {GetCategoryName(item.column)}
              </label>
              {
                item.column === 'vendor_no' ? (
                  <select
                    value={item.value}
                    onChange={(e) => {
                      handlerMainTableChange(e, i)
                    }}
                  >
                    {tableColumns.Vendors.map((vendor, index) => (
                      <option key={index} value={vendor.vendor_no}>
                        {getVendorName(vendor.vendor_no)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type='number'
                    value={item.value || ''}
                    min={0}
                    id={`stock-product-${i}`}
                    className={styles.DigitInput}
                    onChange={(e) => {
                      handlerMainTableChange(e, i)
                    }}
                  />
                )
              }
            </div>
          ))}
        </div>


        {/* ***************************** Product Main Table Information's ********************************/}
        <div className={styles.DigitNames}>
          {MainTableEndIndex.slice(5).map((item, i) => (
            <div key={i} className={styles.DigitGroup}>
              <label htmlFor={`main-product-${i}`} className={styles.DigitLabel}>
                {GetCategoryName(item.column)}
              </label>
              {item.column === 'image' ? (
                <>
                  {item.value && item.value.startsWith('data:image') && (
                    <img src={item.value} alt="Product" className={styles.ProductImage} />
                  )}
                  <input type="file" id={`main-product-${i}`} className={styles.DigitInput} onChange={(e) => handleImageFileChange(e, i + 5, 'main')} />
                </>
              ) :
                item.column === 'discount_type' ? (
                  <select id={`main-product-${i}`} value={item.value} onChange={(e) => { handlerMainTableChange(e, i + 5) }}>
                    {
                      ['amount', 'percentage'].map((item_, index) => {
                        return <option key={index} value={item_}>{item_}</option>
                      })
                    }
                  </select>
                ) : item.column === 'sub_category' ? (
                  <select id={`main-product-${i}`} value={item.value} onChange={(e) => { handlerMainTableChange(e, i + 5) }}>
                    {
                      subCategory.map((item_, index) => {
                        return <option key={index} value={item_}>{item_}</option>
                      })
                    }
                  </select>
                ) :
                  (
                    <input type="text" value={item.value} id={`main-product-${i}`} className={styles.DigitInput} onChange={(e) => { handlerMainTableChange(e, i + 5) }} />
                  )}
            </div>
          ))}
        </div>

        {/* ***************************** Product Description Information's ********************************/}
        <div className={styles.DigitNames}>
          {
            DesEndIndex.map((item, i) => (
              <div key={i} className={styles.DigitGroup}>
                <label htmlFor={`product-description-${i}`} className={styles.DigitLabel}>Head</label>
                <input type='text' value={item.column} id={`product-description-${i}`} className={styles.DigitInput} onChange={(e) => { handleDescriptionChange(e, i, 'main', 'head') }} />

                <label htmlFor={`product-description-${i}`} className={styles.DigitLabel}> {item.column} </label>
                <input type='text' value={item.value} id={`product-description-${i}`} className={styles.DigitInput} onChange={(e) => { handleDescriptionChange(e, i, 'main', 'value') }} />
                <button className={styles.buttonChange} onClick={() => { handleDeleteDes(i, item.no, 'main') }}>Delete</button>
              </div>
            ))
          }
          {
            newChanges.newAddedDes.length !== 0 && (
              newChanges.newAddedDes.map((item, i) => (
                <div key={i} className={styles.DigitGroup}>
                  <label htmlFor={`product-new-description-${i}`} className={styles.DigitLabel}>Head</label>
                  <input type='text' value={item.column} id={`product-new-description-head-input-${i}`} className={styles.DigitInput} onChange={(e) => { handleDescriptionChange(e, i, 'new', 'head') }} />

                  <label htmlFor={`input-${i}`} className={styles.DigitLabel}> Value </label>
                  <input type='text' value={item.value} id={`product-new-description-value-input-${i}`} className={styles.DigitInput} onChange={(e) => { handleDescriptionChange(e, i, 'new', 'value') }} />
                  <button className={styles.buttonChange} onClick={() => { handleDeleteDes(i, item.value, '') }}>Delete</button>
                </div>
              ))
            )
          }
          <button className={styles.buttonChange} onClick={handleAddDes}>+Add New</button>
        </div>

        {/* ***************************** Product Extra Images Information's ********************************/}
        <div className={styles.DigitNames}>
          {
            ExtraImgEndIndex.map((item, i) => (
              <div key={i} className={styles.DigitGroup}>
                {item.value && item.value.startsWith('data:image') && (
                  <>
                    <img src={item.value} alt="Product" className={styles.ProductImage} />
                    <input type="file" id={`product-img-${i}`} className={styles.DigitInput} onChange={(e) => handleImageFileChange(e, i, 'extra')} />
                  </>

                )}
                <button className={styles.buttonChange} onClick={() => { handleDeleteImg(i, item.no, 'extra') }}>Delete</button>
              </div>
            ))
          }
          {
            newChanges.newAddedImg.length !== 0 && (

              newChanges.newAddedImg.map((item, i) => (
                <div key={i} className={styles.DigitGroup}>
                  <img src={item.value} alt="Product" className={styles.ProductImage} />
                  <input type="file" id={`new-product-img-${i}`} className={styles.DigitInput} onChange={(e) => handleImageFileChange(e, i, '')} />
                  <button className={styles.buttonChange} onClick={() => { handleDeleteImg(i, '') }}>Delete</button>
                </div>
              ))

            )
          }
          <button className={styles.buttonChange} onClick={handleAddNewImg}>+Add New Image</button>
        </div>
      </div>


      {/* ****************************** Main Operation Buttons ********************************* */}
      <div className={styles.ProductionChangeButtons}>
        <button className={styles.buttonChange} onClick={() => { handleUpdateProduct() }}>Save Changes</button>
        <button className={styles.buttonChange} onClick={() => { setIsProductionManagement(false) }}>Back</button>
      </div>

    </section>
  );
}
)

export default ProductionTableManage;
