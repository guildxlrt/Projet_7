import React from 'react'
import { useSelector } from 'react-redux'
import BlockAccount from './BlockAccount'
import ChangePassword from './ChangePassword'
import UpdateUserInfos from './UpdateUserInfos'
import UploadImg from './UploadImg'



const UserProfil = () => {
  const userData = useSelector((state) => state.userReducer)  

  return (
    <div className='profil-container'>
        <h1>{userData.surname} {userData.name}</h1>
        <div className='update-container'>
          <UploadImg/>
          <UpdateUserInfos/>
          <ChangePassword/>
          <BlockAccount/>
        </div>
    </div>
  )
}

export default UserProfil