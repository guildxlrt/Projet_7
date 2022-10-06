import React, { useContext } from 'react'
import { UkeyContext } from '../appContext'
import BlockAccount from './BlockAccount'
import ChangePassword from './ChangePassword'
import UpdateUserInfos from './UpdateUserInfos'
import UploadImg from './UploadImg'



const UserProfil = () => {
  const ukey = useContext(UkeyContext)


  return (
    <div className="profil-page">
      <div className='profil-container'>
          <h1 className='user-management'>Gestion du compte</h1>
          <div className='update-container'>
            <UploadImg/>
            <UpdateUserInfos/>
            <ChangePassword/>
            {ukey ? (
              <div className='right-part admin'>
                <h2 >Vous etes administrateur.</h2>
              </div>
            ) : (
              <BlockAccount/>
            )}
          </div>
      </div>
    </div>
    
  )
}

export default UserProfil