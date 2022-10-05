import React, { useContext } from 'react'
import { UidContext } from '../components/appContext'
import Log from '../components/Log'
import UserProfil from '../components/Profil'

const Profil = () => {
  const uid = useContext(UidContext)

  return (
    <div className="profil-page">
      {uid ? (
        <UserProfil/>
      ) : (
        <div className="log-container">
            <Log signin={false} signup={true} />
            <div className="img-container"></div>
        </div>
      ) }
    </div>
  )
}

export default Profil