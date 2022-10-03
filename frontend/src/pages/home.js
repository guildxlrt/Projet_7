import React, { useContext } from 'react'

import Log from '../components/Log'
import { UidContext } from '../components/appContext'
// import { UkeyContext } from '../components/appContext'


const Home = () => {
  const uid = useContext(UidContext)
  // const ukey = useContext(UkeyContext)

  return (
    <div>
      {uid ? (
        <div className="home"></div>
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
      <a href="/profil">
      <img src="./img/icon.png" alt="icon" />
      </a>
    </div>
  )
}

export default Home