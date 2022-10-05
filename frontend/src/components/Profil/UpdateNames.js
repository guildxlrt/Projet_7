import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateNames } from '../../actions/user.actions';
import errorReducer from '../../reducers/error.reducer';

const UpdateNames = () => {
    const userData = useSelector((state) => state.userReducer)
    //const errorRepport = useSelector((state) => state.errorReducer)
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

    const handleValidation = (e) => {
        e.preventDefault()

        const surnameError = document.querySelector('.error.surname')
        const nameError = document.querySelector('.error.name')

        surnameError.innerHTML = "";
        nameError.innerHTML = "";

        //envoyer les donnees
        const datas = {}
        datas.surname = surname
        datas.name = name
        dispatch(updateNames(datas, userData.id))

        const errSurname = errorReducer.surname

        console.log(errSurname)
        
        // rafraichissement de linterface
        setClickOn(false)
    }
  return (
    <>
        {clickOn ? (
            <div>
                <form action="" onSubmit={handleValidation} >
                    <h4>Prénom :</h4>
                    <input className='surname-input' type="text" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} value={surname} />
                    <h4>Nom de famille :</h4>
                    <div className="error surname"></div>
                    <input className='name-input' type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} />
                    <div className="error name"></div>
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