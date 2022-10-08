import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UkeyContext } from '../appContext'
import { birthdayFormat, dateFormat } from '../utils'

const Block = () => {
    const [pageload, setPageload] = useState(true)
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
    const urlId = getIdFromUrl()             
    
    //------// Recuperer Donnees utilisateur
    useEffect(() => {
        (async function getUserDatas() {

            await axios({
                method : "get",
                url : `${process.env.REACT_APP_API_URL}/api/users/${urlId}`,
                withCredentials : true
            })
            .then((res) => {
                const datas = { ...res.data } 
                datas.signupDate = dateFormat(res.data.signupDate)
                datas.age = dateFormat(res.data.birthday)
                datas.birthday = birthdayFormat(res.data.birthday)

                setAccount(datas)
            })
            .catch((error) => console.log(error))

           setPageload(false)
        })()
    }, [pageload])

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
            url : `${process.env.REACT_APP_API_URL}/api/users/${urlId}/disable`,
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
                    <h3>{account.surname}</h3>
                    <br/>
                    <h3>{account.name}</h3>
                    {ukey ? (
                        <>
                            <br/>
                            <h3>{account.email}</h3>
                        </>
                    ) : (
                        <>
                            <br/>
                            <h3>{account.age}</h3>
                            <br/>
                            <h3>{account.birthday}</h3>
                        </>
                    )}
                    
                    <br/>
                    <h3>Membre depuis {account.signupDate}</h3>
                    <br/>
                    {!(account.isAdmin) ? (
                        ukey && (accStatus ? (
                                <>
                                    <button onClick={handleBlockAccount}>Désactiver</button>
                                    <br/><br/>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleBlockAccount}>Activer</button>
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

export default Block