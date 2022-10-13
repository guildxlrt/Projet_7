import React from "react";
import axios from "axios";
import cookie from 'js-cookie';

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
    <li onClick={logout} className="logout" >
        <img src="./images/icons/logout.svg" alt="logout"/>
    </li>
  )
}

export default Logout 