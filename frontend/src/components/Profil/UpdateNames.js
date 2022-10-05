import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateNames } from '../../actions/user.actions';
import axios from 'axios';

const UpdateNames = () => {
    const userData = useSelector((state) => state.userReducer)

    const dispatch =  useDispatch();

    // Variables du rendu
    const [surname=userData.surname, setSurname] = useState()
    const [name=userData.name, setName] = useState()
    // variable pour le ternaire
    const [clickOn, setClickOn] = useState(false)

    const anullForm = (e) => {
        e.preventDefault()

        setSurname(userData.surname)
        setName(userData.name)
        setClickOn(false)
    }

    const handleValidation = async (e) => {
        e.preventDefault()

        const surnameError = document.querySelector('.error.surname')
        surnameError.innerHTML = "";
        const nameError = document.querySelector('.error.name')       
        nameError.innerHTML = "";

        //envoyer les donnees
        const datas = {}
        datas.surname = surname
        datas.name = name

        await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/update`,
            withCredentials : true,
            data : datas
        })
        .then(async () => {
            dispatch(updateNames(datas))
        })
        .catch((error) => {
            const err = error.response.data
            if (err.surname) {
                surnameError.innerHTML = err.surname
                surnameError.removeAttribute('hidden')
            }
            if (err.name) { nameError.innerHTML = err.name }
        })
        
        // rafraichissement de linterface
        //setClickOn(false)
    }
  return (
    <>
        {clickOn ? (
            <div>
                <form action="" onSubmit={handleValidation} >
                    <h4>Prénom :</h4>
                    <input className='surname-input' type="text" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} value={surname} />
                    <br/>
                    <div className="error surname" hidden></div>

                    <h4>Nom de famille :</h4>
                    <input className='name-input' type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} />
                    <br/>
                    <div className="error name"></div>

                    <br/>
                    <input type="submit" value="Modifier" />
                    <button className='pic-button' onClick={anullForm} >Annuler</button>
                </form>
                
            </div>
        ) : (
            <div>
                <h4 className='surname' onClick={() => setClickOn(true)}>Prénom :<br/>{surname}</h4>
                <h4 className='name' onClick={() => setClickOn(true)}>Nom de famille :<br/>{name}</h4>
            </div>
        )}
    </>
  )
}

export default UpdateNames