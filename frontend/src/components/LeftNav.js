import React from 'react'
import {NavLink} from 'react-router-dom'

// fonts
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {faHouseUser, faUser} from '@fortawesome/free-solid-svg-icons'

const LeftNav = () => {
  return (
    <div className="left-nav-container">
        <div className='icons'>
            <div className='icons-bis'>
                <NavLink to="/" exact activeclassname="active-left-nav">
                    <img src="./images/icons/home.svg" alt="icon" />
                </NavLink>
                <br/>
                <NavLink to="/profil" exact activeclassname="active-left-nav">
                    <img src="./images/icons/user.svg" alt="icon" />
                </NavLink>
            </div>
        </div>
    </div>
  )
}

export default LeftNav