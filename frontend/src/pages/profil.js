import React, { useContext } from 'react'
import Log from '../components/Log'
import { UidContext } from '../components/appContext'
import { UkeyContext } from '../components/appContext'


const Profil = () => {
  const uid = useContext(UidContext)
  const ukey = useContext(UkeyContext)

  return (
    <div className="profil-page">
      {uid ? (
        <div>
          <h1>UPDATE PAGE</h1>
          <br /> 
          <h2>Welcome user {uid}</h2>
          {ukey ? (
            <div>
              <br /> 
              <p>You are an Admin</p>
            </div> ) : (
              <div>
              <br /> 
              <p>You are a normal user</p>
            </div>
            )}
        </div>
      ) : (
        <div className="log-container">
          <Log signin={false} signup={true} />
          <div className="img-container">
            {/* <img src="./img/log.svg" alt="img-log" /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profil