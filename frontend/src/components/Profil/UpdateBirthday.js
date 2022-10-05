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

    const handleBirth = (e) => {
        e.preventDefault()

        const btnValue = document.getElementById('birth-submit').value

        if (btnValue === "Modifier") {
            dispatch(updateBirthday(formDate, userData.id))

            setBirthday(formDate)
            setBirthForm(false)
        } else if (btnValue === "Annuler") {
            setBirthForm(false)
        }
        
        
    }

    return (
        <>
            {birthForm ? (
                <div className='birth-container'>
                    <form action="" onSubmit={handleBirth} >
                        <h4>Née le :</h4>
                        <input type="date" name="birthday" id="birthday" onChange={birthChange}  value={formDate}  />
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
                    <h4 className='birth' onClick={() => setBirthForm(true)}>Née le :<br/><br/>{birthday}</h4>
                </div>
            )}
        </>
    )
}

export default UpdateBirthday