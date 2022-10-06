import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateBirthday } from '../../actions/user.actions';

const UpdateBirthday = () => {
    const userData = useSelector((state) => state.userReducer)
    const dispatch = useDispatch();

    const [birthday=userData.birthday, setBirthday] = useState()
    const [formDate, setFormDate] = useState('')
    const [birthForm, setBirthForm] = useState(false)
    const [birthButton, setBirthButton] = useState(false)     

    const birthChange = (e) => {
        e.preventDefault()

        setFormDate(e.target.value)
        setBirthButton(true)
        if (e.target.value === '') {
            setBirthButton(false)
        }
    }

    const handleBirth = async (e) => {
        e.preventDefault()

        const btnValue = document.getElementById('birth-submit').value

        const dateError = document.querySelector('.error.birthday')
        dateError.innerHTML = "";

        if (btnValue === "Modifier") {   
            await axios({
                method : "put",
                url : `${process.env.REACT_APP_API_URL}/api/users/update`,
                withCredentials : true,
                data : {
                    birthday : formDate
                }
            })
            .then(async () => {
                dispatch(updateBirthday(formDate))
                
                // rafraichissement de linterface
                setBirthday(formDate)
                setBirthForm(false)
            })
            .catch((error) => {
                const err = error.response.data
                if (err.date) {
                    dateError.innerHTML = err.date
                    dateError.removeAttribute('hidden')
                }
                if (err.legal_age) {
                    dateError.innerHTML = err.legal_age
                    dateError.removeAttribute('hidden')
                }
            })
        }
        else if (btnValue === "Annuler") {
            setBirthForm(false)
        }
    }

    return (
        <>
            {birthForm ? (
                <div className='birth-container'>
                    <form action="" onSubmit={handleBirth} >
                        <input type="date" name="birthday" id="birthday" onChange={birthChange}  value={formDate}  />
                        <br/>
                        <div className="error birthday" hidden></div>
                        <br/>
                        {birthButton ? (
                            <>
                                <input type="submit" id="birth-submit" value="Modifier"></input>
                            </>
                        ) : (
                            <>
                                <input type="submit" id="birth-submit" value="Annuler"></input>
                            </>
                        )}
                    </form>
                </div>
            ) : (
                <div>
                    <h4 className='birth' onClick={() => setBirthForm(true)}>{birthday} ans</h4>
                </div>
            )}
        </>
    )
}

export default UpdateBirthday