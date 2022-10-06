import React from 'react'
import { useSelector } from 'react-redux';
import UpdateBirthday from './UpdateBirthday'
import UpdateNames from './UpdateNames';

const UpdateUserInfos = () => {
    const userData = useSelector((state) => state.userReducer)

    return (
        <div className='right-part'>
            <h2>Informations Personnelles</h2>
            <UpdateNames/>
            <UpdateBirthday/>
            <h4>{userData.email}</h4>
            <h4>Inscrit depuis le : {userData.signupDate}</h4>

        </div>
    )
}

export default UpdateUserInfos