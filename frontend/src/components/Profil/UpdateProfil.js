import React from 'react'
import { useSelector } from 'react-redux'
import UploadImg from './UploadImg'


const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer)
    

  return (
    <div className='profil-container'>
        <h1>{userData.surname} {userData.name}</h1>
        <div className='update-container'>
            <div className='left-part'>
                <h3>Photo de profil</h3>
                <UploadImg/>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfil