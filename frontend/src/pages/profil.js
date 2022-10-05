import React, { useContext } from 'react'
import { UidContext } from '../components/appContext'
// import { UkeyContext } from '../components/appContext'
import Log from '../components/Log'
import UserProfil from '../components/Profil/UserProfil'

const Profil = () => {
  const uid = useContext(UidContext)
  //const ukey = useContext(UkeyContext)

  return (
    <div className="profil-page">
      {uid ? (
        <div>
          <UserProfil/>
        </div>
      ) : (
        <div className="log-container">
            <Log signin={false} signup={true} />
            <div className="img-container">
            </div>
          </div>
      ) }
    </div>
  )
}

export default Profil