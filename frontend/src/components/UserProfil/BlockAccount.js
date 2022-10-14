import axios from 'axios'
import React, { useContext, useState } from 'react'
import { UidContext } from '../appContext'
import cookie from 'js-cookie';

const BlockAccount = () => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [clickOn, setClickOn] = useState(false)
    const uid = useContext(UidContext)

    const anullForm = (e) => {
        e.preventDefault()

        setPassword('')
        setEmail('')
        setClickOn(false)
    }

    const handleBlockAccount = async (e) => {
        e.preventDefault();

        // baslises erreur
        const errorDiv = document.getElementById('error-container-disable')
        const errorReport = document.getElementById('error-disable')
        errorReport.innerHTML = ""
        

        //envoyer les donnees
        const datas = {}
        datas.password = password
        datas.email = email

        await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/${uid}/disable`,
            withCredentials : true,
            data : datas
        })
        .then(async () => {
            const removecookie = (key) => {
                if (window !== "undefined") {
                    cookie.remove(key, { expires : 1});
                }
            }
        
            await axios({
                method : "delete",
                url : `${process.env.REACT_APP_API_URL}/api/users/logout`,
                withCredentials : true
            })
            .then(() => removecookie('jwt'))
            .catch((err) => console.log(err))
    
            window.location = "/"
        })
        .catch((error) => {
            errorDiv.removeAttribute('hidden')

            const err =  error.response.data.error;
            console.log(err)
            if (err) {errorReport.innerHTML = err} 
        })
    }

    return (
        <div className='right-part'>
            <h3>Desactiver le compte</h3>

            {clickOn ? (
                <>
                    <form form action="" onSubmit={handleBlockAccount}>
                        <h4>Attention, vous ne pourrez plus vous connecter au reseau Groupomania !</h4>
                        <span>Contactez l'administrateur pour la reactivation du compte.</span>
                        <br/>
                        <br/>

                        <div id="error-container-disable" hidden>
                            <div id="error-disable" className='error disable'></div>
                            <br/>
                        </div>
                        
                        <label htmlFor="password">Mot de passe</label>
                        <br/>
                        <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />

                        <br/><br/>
                        <label htmlFor="email">Email</label>
                        <br/>
                        <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                        
                        <br/><br/>
                        <input type="submit" value="Confirmer" />
                        <br/><br/>
                        <button onClick={anullForm}>Annuler</button>
                    </form>
                </>
            ) : (
                <>
                    <button onClick={() => setClickOn(true)}>Désactiver</button>
                </>
            )}
        </div>
    )
}

export default BlockAccount