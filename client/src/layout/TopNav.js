import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/useData';
import styles from '../styles/HomePageStyles/topnav.module.css';
import { GetCategoryName } from '../HOOKS/GetCategoryName';

const TopNav = () => {
  const { dataState } = useContext(useData);
  const { menuItems } = dataState;

  // console.log('Menu Items:', menuItems);

  return (
    <nav id={styles.TopNav}>
      <label htmlFor="drop" className={styles.toggle}>&#8801; Menu</label>
      <input type="checkbox" id="drop" />
      <ul className={styles.menu}>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.nested.length > 0 ? (
              <>
                <label htmlFor={`drop-${item.id}`} className={styles.toggle}>{GetCategoryName(item.title)} +</label>
                <Link to={item.url}>{GetCategoryName(item.title)}</Link>
                <input type="checkbox" id={`drop-${item.id}`} />
                <SubMenu items={item.nested} />
              </>
            ) : (
              <Link to={item.url}>{GetCategoryName(item.title)}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

const SubMenu = ({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        {item.nested && item.nested.length > 0 ? (
          <>
            <label htmlFor={`drop-${item.id}`} className={styles.toggle}>{GetCategoryName(item.title)} +</label>
            <Link to={item.url}>{GetCategoryName(item.title)}</Link>
            <input type="checkbox" id={`drop-${item.id}`} />
            <SubMenu items={item.nested} />
          </>
        ) : (
          <Link to={item.url}>{GetCategoryName(item.title)}</Link>
        )}
      </li>
    ))}
  </ul>
);

export default TopNav;
