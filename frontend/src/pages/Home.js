import React, { useContext } from 'react'

import Log from '../components/Log'
import { UidContext } from '../components/appContext'
import Publications from '../components/Publications'

const Home = () => {
  const uid = useContext(UidContext)

  return (
    <>
      {uid ? (
        <div className='home'>
          <div></div>
          <div className="main">
            <div className="home-header">
              <Publications/>
            </div> 
          </div>
          <div></div>
            
          
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
    </>
  )
}

export default Home