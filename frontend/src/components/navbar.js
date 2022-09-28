import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "./appContext";
import Logout from "./Log/logout";

const Navbar = () => {
    const uid = useContext(UidContext)
  return (
    <nav>
        <div className="nav-container">
            <div className="logo">
                <NavLink exact to="/">
                    <div className="logo">
                        {/* <img src="" alt="icon" /> */}
                        <h3>Groupomania</h3>
                    </div>
                </NavLink>
            </div>
            {uid ? (
                <ul>
                    <li></li>
                    <li className="welcome">
                        <navlink exact to="profil">
                            <h5>bienvenue 'valeur dynamique'</h5>
                        </navlink>
                    </li>
                    <Logout />
                </ul>
            ) : (
                <ul>
                    <li></li>
                    <li>
                        <NavLink exact to="/profil">
                            {/* <img src="" alt="" /> */}
                        </NavLink>
                    </li>
                </ul>
            )}
        </div>
    </nav>
  )
}

export default Navbar