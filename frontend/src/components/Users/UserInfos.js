import axios from 'axios'
import React, { useContext } from 'react'
import { UkeyContext } from '../appContext'
import { birthdayFormat, dateFormat } from '../utils'

const UserInfos = ({user}) => {
    const ukey = useContext(UkeyContext)

    const blockAccount = async (e) => {
        e.preventDefault();

        const messageDiv = document.getElementById('messages')
        const successMsg = document.querySelector('.success')
        successMsg.innerHTML = ""
        const errorMsg = document.querySelector('.error')
        errorMsg.innerHTML = ""
        
        await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/${user.id}/disable`,
            withCredentials : true
        })
        .then((res) => {           
            successMsg.innerHTML = res.data.message;
            messageDiv.removeAttribute('hidden')
        })
        .catch((error) => { 
            messageDiv.removeAttribute('hidden')
            if (error) errorMsg.innerHTML = 'Erreur interne'
        })
    }
    return (
        <>
            <h1 className='user-management'>{user.surname} {user.name}</h1>
            <div className='update-container admin'>
                <br/>
                <div className='left-part'>
                    <img src={user.avatarUrl} alt="user-pic"/>
                    <h3>{user.surname}</h3>
                    <br/>
                    <h3>{user.name}</h3>
                    <br/>
                    <h3>{user.age}</h3>
                    <br/>
                    <h3>{user.birthday}</h3>
                    
                    <br/>
                    <h3>Membre depuis {user.signupDate}</h3>
                    <br/>
                    {!(user.isAdmin) ? (
                        ukey && (user.isActive ? (
                                <>
                                    <button onClick={blockAccount}>Désactiver</button>
                                    <br/><br/>
                                </>
                            ) : (
                                <>
                                    <button onClick={blockAccount}>Activer</button>
                                    <br/><br/>
                                </>
                            )
                        )
                    ) : (
                        <>
                            <h3>Administrateur</h3>
                        </>
                    )}
                    
                    <div id="messages" hidden>
                        <br/>
                        <div className='success'></div>
                        <br/>
                        <div className='error'></div>
                    </div>
                </div>
                <br/>
            </div>
        </>
    )
}

export default UserInfos