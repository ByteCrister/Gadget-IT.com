import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { BsBoxSeamFill } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";

import { GetMainTable } from '../HOOKS/GetMainTable';
import { GetCategoryName } from '../HOOKS/GetCategoryName';
import { useData } from '../context/useData';
import styles from '../styles/HomePageStyles/uppernav.module.css'

const NavBar = ({ handleUserEntryPage }) => {
  const { dataState } = useContext(useData);
  const [totalCart, setTotalCart] = useState(0);
  const [buttonState, setBtnState] = useState(1);
  const [searchedProductStore, setSearchedProductStore] = useState({
    product: [],
    category: [],
    prices: []
  });
  const [searchState, setSearchState] = useState('');
  useEffect(() => {
    if (dataState?.CartStorage && dataState?.productStorage?.product_prices) {
      setTotalCart(dataState?.CartStorage?.length);
      setSearchedProductStore((prev) => ({
        ...prev,
        prices: [...dataState.productStorage.product_prices]
      }));
      // console.log(searchedProductStore.prices);
      // console.log(dataState.productStorage.product_prices);
    }
  }, [dataState?.CartStorage, dataState?.productStorage?.product_prices]);


  const findPrice = (product_id) => {
    const Product = searchedProductStore?.prices.find(product => product.product_id === product_id)
    return Product ? Product.price : 0;
  };

  const getProductPoint = (product_name, searchedStr) => {
    let point = 0;
    let sequenceBreak = 0;
    let isSubString = false;

    // Normalize and split input strings for word-level matching
    const productWords = product_name.toLowerCase().split(' ');
    const searchWords = searchedStr.toLowerCase().split(' ');

    // Prioritize word matches
    productWords.forEach((productWord) => {
      searchWords.forEach((searchWord) => {
        // Exact match
        if (productWord === searchWord) {
          point += 30; // Higher points for exact match
        }
        // Substring match
        else if (productWord.includes(searchWord) || searchWord.includes(productWord)) {
          if (!isSubString) {
            isSubString = true;
            point += 20; // Moderate points for substring match
          }
        }
      });
    });

    // Remove spaces for character-level matching
    product_name = product_name.replace(/ /g, '').toLowerCase();
    searchedStr = searchedStr.replace(/ /g, '').toLowerCase();

    // Character-level scoring with penalty for breaks
    let lastMatchIndex = -1;
    for (let i = 0; i < searchedStr.length; i++) {
      const char = searchedStr[i];
      const matchIndex = product_name.indexOf(char, lastMatchIndex + 1);

      if (matchIndex !== -1) {
        point += 1; // Base point for character match
        if (matchIndex === lastMatchIndex + 1) {
          point += 2; // Bonus for sequential matches
        } else {
          sequenceBreak++;
          point -= sequenceBreak; // Penalty for sequence break
        }
        lastMatchIndex = matchIndex;
      }
    }

    // Cap minimum points to zero to avoid negative scores
    return Math.max(point, 0);
  };


  const renderSearchedProducts = () => {
    if (searchedProductStore.product.length === 0) {
      return (
        <span>No product found!</span>
      )
    }
    return (
      <section className={styles.SearchedSelectedProductSection} onClick={() => setSearchState('')}>
        {
          searchedProductStore.product &&
          searchedProductStore.product.map((row) => {
            return <Link to={`/view/${row.main_category}/${row.product_id}`} key={row.product_id} className={styles.SearchedProductLink}>
              <did className={styles.SearchedProductImgDiv}><img src={row.image} alt={`image-${row.product_id}`}></img></did>
              <div className={styles.SearchedProductNamePrices}>
                <span className={styles.Name}>{row.name} | {row.brand} |</span>
                <div>
                  <span className={styles.Price}>{row.price}৳</span>
                  {/* {row.cut_price && <span className={styles.CutPrice}>{row.cut_price}৳</span>} */}
                </div>
              </div>
            </Link>
          })
        }
      </section>
    );
  };

  const renderSearchedProductCategory = () => {
    if (searchedProductStore.category.length === 0) {
      return (
        <span>No category have matched!</span>
      )
    }

    return (
      <section className={styles.SearchSelectedCategory} onClick={() => setSearchState('')}>
        {
          searchedProductStore.category &&
          searchedProductStore.category.map((category) => {
            let link = `/products/${category.main}`;
            link += category.sub && category.sub.length !== 0 ? `/${category.sub}` : '';
            return <Link to={link} className={styles.CategoryLink}>
              | {GetCategoryName(category.main)} |   {category.sub && category.sub.length !== 0 ? ` | ${GetCategoryName(category.sub)} |` : null}
            </Link>
          })
        }
      </section>
    );

  };

  const handleSearching = () => {
    let productStore = [];
    let categoryStore = [];
    let namePoint = 0;
    if (dataState?.productStorage?.product_table) {
      dataState.productStorage.product_table.forEach((table) => {

        // *params @table contains main table of products
        table.table_products.forEach((product) => {

          // *table.@table_products is an array of objects - contains different product rows
          let point = 0;
          let appendedStr = '';

          // * converting @Product Object into array filed
          Object.entries(product).forEach(([key, value]) => {
            if (key !== 'product_id' && key !== 'hide' && key !== 'discount_type' && key !== 'discount_value' && key !== 'image' && key !== 'vendor_no') {

              const isInclude = String(value) && String(value).toLowerCase().includes(String(searchState).toLowerCase());

              point += isInclude ? 1 : 0;
              point += key === 'brand' && isInclude ? 2 : 0;
              if (key === 'product_name') {
                namePoint = getProductPoint(String(value), String(searchState))
                point += namePoint;
              }
              appendedStr += key !== 'product_name' && key !== 'main_category' && key !== 'sub_category' && isInclude && value && String(value).length !== 0 ? ` |${String(value)}|` : '';
            }
          });
          if (point !== 0) {
            productStore.push({
              product_id: product.product_id,
              name: product.product_name + appendedStr,
              brand: product.brand,
              image: product.image,
              price: findPrice(product.product_id),
              main_category: product.main_category,
              sub_category: product.sub_category,
              point: point,
              namePoint: namePoint
            });
          }
        });
      });

      // *filtering most matched substring's
      productStore = productStore.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          if (key !== 'product_id' && key !== 'hide' && key !== 'discount_type' && key !== 'discount_value' && key !== 'image' && key !== 'vendor_no') {
            return String(value).toLowerCase().includes(String(searchState).toLowerCase()) || String(searchState).toLowerCase().includes(String(value).toLowerCase());
          }
          return false;
        });
      });

      // *sorting matched product based on point's
      productStore.sort((a, b) => b.point - a.point);

      // *finding matched product's unique category's
      productStore.forEach((product) => {
        const MainCategory = GetMainTable(product.main_category, dataState.productStorage.category, dataState.productStorage.subCategory);
        const isMainStored = categoryStore.some((product_) => product_.main.toLowerCase() === product.main_category.toLowerCase());
        const isSubStored = categoryStore.some((product_) => product_.sub.toLowerCase() === product.sub_category.toLowerCase());
        if (product.main_category && MainCategory && product.main_category.toLowerCase() === MainCategory.toLowerCase()) {
          if (!isMainStored) {
            categoryStore.push({
              main: product.main_category,
              sub: ''
            });
          }
        }
        if (!(isMainStored && isSubStored)) {
          categoryStore.push({
            main: product.main_category,
            sub: product.sub_category
          });
        }
      });

      //// console.log(productStore);
      // // console.log(categoryStore);
      // *updating state values
      setSearchedProductStore((prev) => ({
        ...prev,
        product: [...productStore],
        category: [...categoryStore]
      }));
    }
  };

  return (
    <div className={styles.upperNav}>
      <div ><Link to={'/'} className={styles.logo}>GADGET IT</Link></div>
      <section className={styles.InputSection}>
        <input type="text" onChange={(e) => { setSearchState(e.target.value); handleSearching(); }} placeholder="Search..." />
        <div className={searchState.length !== 0 ? styles.InputSearchAns : styles.InputSearchAnsHide}>
          <div className={styles.InputSearchAnsBtn}>
            <button className={buttonState === 1 ? styles.ActiveBtn : styles.DefaultBtn} onClick={(() => setBtnState(1))}>Products</button>
            <button className={buttonState === 2 ? styles.ActiveBtn : styles.DefaultBtn} onClick={(() => setBtnState(2))} >Category</button>
          </div>
          <div className={buttonState === 1 ? searchedProductStore.product.length === 0 ? styles.InputDefaultAllAnswers : styles.InputAllAnswers : buttonState === 2 ? searchedProductStore.category.length === 0 ? styles.InputDefaultAllAnswers : styles.InputAllAnswers : null}>
            {buttonState === 1 ? renderSearchedProducts() : renderSearchedProductCategory()}
          </div>
        </div>
      </section>

      <div className={styles.upperContents}>

        <Link to={'offers'} className={styles.navLink}>
          <div className={styles.offerBox}>
            <BsBoxSeamFill className={styles.Icon} />
            <div className={styles.Head_and_Text}>
              <span className={styles.Head}>
                Offers
              </span>
              <span className={styles.Text}>
                Latest Offers
              </span>
            </div>
          </div>
        </Link>

        <Link to={'/user/cart'} className={styles.navLink}>
          <div className={styles.cartBox}>
            <IoCartOutline className={styles.Icon} />
            <div className={styles.Head_and_Text}>
              <span className={styles.Head}>
                Carts({totalCart})
              </span>
              <span className={styles.Text}>
                Add Items
              </span>
            </div>
          </div>
        </Link>

        <Link to="/pre-order" className={styles.navLink}>
          <div className={styles.offerBox}>
            <RiShoppingBag4Fill className={styles.Icon} />
            <div className={styles.Head_and_Text}>
              <span className={styles.Head}>
                Pre-Order
              </span>
              <span className={styles.Text}>
                Order Today
              </span>
            </div>
          </div>
        </Link>


        {
          dataState.isUserLoggedIn ?

            <Link to={'/user/account'} className={styles.navLink}>
              <div className={styles.registerBox}>
                <VscAccount className={styles.Icon} />
                <div className={styles.Head_and_Text}>
                  <span className={styles.Head}>
                    Account
                  </span>
                  <span className={styles.Text}>
                    Profile
                  </span>
                </div>
              </div>
            </Link>

            :

            <Link onClick={() => { handleUserEntryPage(1) }} className={styles.navLink}>
              <div className={styles.registerBox}>
                <VscAccount className={styles.Icon} />
                <div className={styles.Head_and_Text}>
                  <span className={styles.Head}>
                    Account
                  </span>
                  <span className={styles.Text}>
                    Register or Login
                  </span>
                </div>
              </div>
            </Link>

        }

      </div>

    </div>
  )
}

export default React.memo(NavBar);