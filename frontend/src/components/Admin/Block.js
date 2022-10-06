import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UkeyContext } from '../appContext'

const Block = () => {
    const [account, setAccount] = useState({})
    const ukey = useContext(UkeyContext)
    const [accStatus =  account.isActive, setAccStatus] = useState()

    const getIdFromUrl = () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (params.has('id')) {
            const id = params.get('id');
            return id;
        }
        else {
            alert("Erreur : l'identifiant n'est pas present dans l'url");
        }
    }
    const target = getIdFromUrl()
    
    //------// Recuperer Donnees utilisateur
    useEffect(() => {
        (async function getUserDatas() {

            await axios({
                method : "get",
                url : `${process.env.REACT_APP_API_URL}/api/users/${target}`,
                withCredentials : true
            })
            .then((res) => {
                console.log("RESUL INFOS")
                setAccount(res.data)
            })
            .catch((error) => console.log(error)) 
        })()
    }, [])

    //Bloquer un compte
    const handleBlockAccount = async (e) => {
        e.preventDefault();

        const messageDiv = document.getElementById('messages')
        const successMsg = document.querySelector('.success')
        successMsg.innerHTML = ""
        const errorMsg = document.querySelector('.error')
        errorMsg.innerHTML = ""
        
        await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/${target}/disable`,
            withCredentials : true
        })
        .then((res) => {
            if (accStatus === true) {
                setAccStatus(false)
            } else {
                setAccStatus (true)
            }
            
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
            <h1 className='user-management'>{account.surname} {account.name}</h1>
            <div className='update-container admin'>
                <br/>
                <div className='left-part'>
                    <img src={account.avatarUrl} alt="user-pic"/>
                    <h3>Prénom : {account.surname}</h3>
                    <br/>
                    <h3>Nom : {account.name}</h3>
                    <br/>
                    <h3>{account.email}</h3>
                    <br/>
                    <h3>{account.birthday} ans</h3>
                    <br/>
                    <h3>Membre depuis le : {account.birthday}</h3>
                    <br/>
                    {ukey ? (accStatus ? (
                                <button onClick={handleBlockAccount}>Désactiver</button>
                            ) : (
                                <button onClick={handleBlockAccount}>Activer</button>
                            )
                        ) : (
                            <></>
                        )
                    }
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

export default Block