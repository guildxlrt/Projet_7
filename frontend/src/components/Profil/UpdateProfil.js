import React from 'react'
import { useSelector } from 'react-redux'
import UpdateUserInfos from './UpdateUserInfos'
import UploadImg from './UploadImg'



const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer)
    

  return (
    <div className='profil-container'>
        <h1>{userData.surname} {userData.name}</h1>
        <div className='update-container'>
          <UploadImg/>
          <UpdateUserInfos/>
        </div>
    </div>
  )
}

export default UpdateProfil