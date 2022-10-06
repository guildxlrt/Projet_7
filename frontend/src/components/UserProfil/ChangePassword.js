import React, { useState } from 'react'
import axios from 'axios'

const ChangePassword = () => {
    const [password, setPassword] = useState('')
    const [newPass, setNewPass] = useState('')
    const [passConfirm, setPassConfirm] = useState('')
    const [clickOn, setClickOn] = useState(false)
    const [changedPass, setChangedPass] = useState(false)

    const anullForm = (e) => {
        e.preventDefault()

        setPassword('')
        setNewPass('')
        setPassConfirm('')
        setClickOn(false)
    }

    const handlePassword = async (e) => {
        e.preventDefault();

        // baslises erreur
        const errorEntry = document.querySelector('.error.entry')
        errorEntry.innerHTML = "";
        const errorRenew = document.querySelector('.error.renewal')
        errorRenew.innerHTML = "";
        const errorCongr = document.querySelector('.error.congruency')
        errorCongr.innerHTML = "";
        const errorForce = document.querySelector('.error.force')
        errorForce.innerHTML = "";

        //envoyer les donnees
        const datas = {}
        datas.password = password
        datas.newPass = newPass
        datas.passConfirm = passConfirm
        
        await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/password`,
            withCredentials : true,
            data : datas
        })
        .then(() => setChangedPass(true))
        .catch((error) => {
            document.getElementById('messages-bottom').removeAttribute('hidden')

            const e =  error.response.data.error;
            console.log(e)

            if (e.entry)  {errorEntry.innerHTML = e.entry}
            if (e.renewal)  {errorRenew.innerHTML = e.renewal}
            if (e.congruency)  {errorCongr.innerHTML = e.congruency}
            if (e.force)  {errorForce.innerHTML = e.force}
        })
    }

  return (
    <div className='right-part'>
        <h3>Mot de passe</h3>
        
        {clickOn ? (
            <>
                <form action="" onSubmit={handlePassword} >
                    <label htmlFor="password">Actuel</label>
                    <br/>
                    <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    

                    <br/>
                    <label htmlFor="newPass">Nouveau</label>
                    <br/>
                    <input type="password" name="newPass" id="newPass" onChange={(e) => setNewPass(e.target.value)} value={newPass} />

                    <br/>
                    <label htmlFor="passConfirm">Confirmation</label>
                    <br/>
                    <input type="password" name="passConfirm" id="passConfirm" onChange={(e) => setPassConfirm(e.target.value)} value={passConfirm} />

                    <br/>
                    <div id="messages-bottom" hidden={true}>
                        <br/>
                        <div className="error entry"></div>
                        <div className="error renewal"></div>
                        <div className="error congruency"></div>
                        <div className="error force"></div>
                    </div>

                    {changedPass ? (
                        <>
                            <button id='succes-btn' onClick={anullForm}>MDP changé !!</button>
                        </>
                    ) : (
                        <>
                            <br/>
                            <input type="submit" value="Changer" />
                            <br/>
                            <button onClick={anullForm}>Annuler</button>
                        </>
                    )}
                </form>
            </>
        ) : (
            <>
                <button onClick={() => setClickOn(true)}>Le Changer</button>
            </>
        )}
        
    </div>
  )
}

export default ChangePassword