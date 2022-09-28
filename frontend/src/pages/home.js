import React, { useContext } from 'react'

import Log from '../components/Log'
import { UidContext } from '../components/appContext'
import { UkeyContext } from '../components/appContext'


const Home = () => {
  const uid = useContext(UidContext)
  const ukey = useContext(UkeyContext)

  return (
    <div>
      {uid ? (
        <div className="profil-page">
          <div>
          <h1>Welcome user {uid}</h1>
          <br />
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
        </div>
      ) : (
        <div className="profil-page">
          <div className="log-container">
            <Log signin={false} signup={true} />
            <div className="img-container">
              {/* <img src="./img/log.svg" alt="img-log" /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home