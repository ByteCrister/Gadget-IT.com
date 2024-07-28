import React, { useContext } from 'react'
import { useData } from '../../context/useData'

const PageEight = () => {
  const { dispatch } = useContext(useData);

  const handleLogout = () => {
    dispatch({ type: 'set_home_view', payload: { isAdmin: false, isUserLoggedIn: false, UserID: false } })
    window.localStorage.removeItem('_isAdmin');
    window.localStorage.removeItem('_isUserLoggedIn');
    window.localStorage.removeItem('_userId');
    window.localStorage.clear();
  }

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default PageEight