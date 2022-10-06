import React, { useContext } from 'react'

import Log from '../components/Log'
import { UidContext } from '../components/appContext'
import Publications from '../components/Publications'

const Home = () => {
  const uid = useContext(UidContext)

  return (
    <div>
      {uid ? (
        <div className='home'>
          <Publications/>
        </div>
      ) : (
        <div className="profil-page">
          <div className="log-container">
            <Log signin={false} signup={true} />
            <div className="img-container">
            </div>
          </div>
        </div>
      )}
      <a href="/profil">
      <img src="./images/icon.png" alt="icon" />
      </a>
    </div>
  )
}

export default Home