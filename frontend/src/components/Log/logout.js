import React from "react";
import axios from "axios";
import cookie from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

const Logout = () => {
    const removecookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, { expires : 1});
        }
    }

    const logout = async () => {
        await axios({
            method : "delete",
            url : `${process.env.REACT_APP_API_URL}/api/users/logout`,
            withCredentials : true
        })
        .then(() => removecookie('jwt'))
        .catch((err) => console.log(err))

        window.location = "/"
    }

  return (
    <li onClick={logout}>
        <button>
            <span>Déconnexion</span> <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    </li>
  )
}

export default Logout 