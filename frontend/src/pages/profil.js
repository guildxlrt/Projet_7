import React, { useContext } from 'react'
import { UidContext } from '../components/appContext'
// import { UkeyContext } from '../components/appContext'
import Log from '../components/Log'
import UpdateProfil from '../components/Profil/UpdateProfil'

const Profil = () => {
  const uid = useContext(UidContext)
  //const ukey = useContext(UkeyContext)

  return (
    <div className="profil-page">
      {uid ? (
        <div>
          <UpdateProfil/>
        </div>
      ) : (
        <div className="log-container">
            <Log signin={false} signup={true} />
            <div className="img-container">
              {/* <img src="./img/log.svg" alt="img-log" /> */}
            </div>
          </div>
      ) }
    </div>
  )
}

export default Profil