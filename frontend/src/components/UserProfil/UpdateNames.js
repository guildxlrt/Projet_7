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

    const clickNames = (e) => {
        e.preventDefault()

        document.querySelector('h4.name').setAttribute('class', 'name click')
        setClickOn(true)
    }
    

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
            
            // rafraichissement de linterface
            setClickOn(false)
        })
        .catch((error) => {
            const err = error.response.data
            if (err.surname) {
                surnameError.innerHTML = err.surname
                surnameError.removeAttribute('hidden')
            }
            if (err.name) { nameError.innerHTML = err.name }
        })
    }
  return (
    <>
        {clickOn ? (
            <div>
                <form action="" onSubmit={handleValidation} >
                    <input className='surname input' type="text" id="surname" onChange={(e) => setSurname(e.target.value)} value={surname} />
                    <br/>
                    <div className="error surname" hidden></div>

                    <input className='name input' type="text" id="name" onChange={(e) => setName(e.target.value)} value={name} />
                    <br/>
                    <div className="error name"></div>

                    <br/>
                    <input type="submit" value="Modifier" />
                    <button className='pic-button' onClick={anullForm} >Annuler</button>
                </form>
                
            </div>
        ) : (
            <>
                <div onClick={clickNames}>
                    <h4 className='surname'>Prénom : {surname}</h4>
                </div>
                <div onClick={clickNames}>
                    <h4 className='name'>Nom : {name}</h4>
                </div>
            </>
        )}
    </>
  )
}

export default UpdateNames