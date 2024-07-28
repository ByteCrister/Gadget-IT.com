import React, { useEffect, useState } from 'react'
import styles from '../../styles/AdminHome/PageThree.module.css'
import ProductionPage from '../../ProductionPage.json';
import HeadPoints from '../../HeadPoints.json';
import ProductionTable from '../../components/AdminHome/ProductionTable';
import ProductionTableManage from '../../components/AdminHome/ProductionTableManage';


const PageThree = () => {
  const [productionData, setProductionData] = useState(ProductionPage);
  const [headPointData, setHeadPointData] = useState(HeadPoints);

  const [data, setData] = useState({ data1: null, data2: null });

  const handleProductionID = (id) => {
    const data1 = productionData.filter((value) => {
      return value.productId === id;
    }).map((value) => { return value; });

    const data2 = headPointData.filter((value) => {
      return value.productId === id;
    }).map((value) => { return value; });

    setData({ data1: data1, data2: data2 });

  }
  useEffect(() => {
    // console.log('Updated data:', JSON.stringify(data, null, 2));
  }, [data]);


  return (
    <div id={styles.mainProductionContainer}>

      <ProductionTable handleProductionID={handleProductionID} productionData={productionData} />

      <ProductionTableManage data={data} />


    </div>
  )
}

export default PageThree