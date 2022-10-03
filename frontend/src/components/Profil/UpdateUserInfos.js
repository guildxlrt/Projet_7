import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const UpdateUserInfos = () => {
    const userData = useSelector((state) => state.userReducer)
    const dispatch = useDispatch();

    const [birthday, setBirthday] = useState('')
     


    return (
        <div className='right-part'>
            <h3>Informations Personnelles</h3>
            <form>
                <h4>{userData.surname}</h4>
                <h4>{userData.name}</h4>
                <input type="date" name="birthday" id="birthday" onChange={(e) => setBirthday(e.target.value)}  value={birthday}  />
                <h4>{userData.birthday}</h4>
            </form>
            
            <h4>{userData.email}</h4>
            <h4>{userData.signupDate}</h4>
            <h4>{userData.password}</h4>

        </div>
    )
}

export default UpdateUserInfos