import React, { useContext } from 'react'
import { UidContext } from '../components/appContext'
import Log from '../components/Log'
import UserProfil from '../components/UserProfil'

const Profil = () => {
  const uid = useContext(UidContext)

  return (
    <>
      {uid ? (
        <UserProfil/>
      ) : (
        <div className="profil-page">
          <div className="log-container">
              <Log signin={false} signup={true} />
          </div>
        </div>
        
      ) }
    </>
  )
}

export default Profil