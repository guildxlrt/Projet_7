import React, { useContext } from 'react'
import Block from '../components/Admin/Block'
import { UkeyContext } from '../components/appContext'

const AdminAnAccount = () => {
    const ukey = useContext(UkeyContext)

    if (!ukey) {
        window.location = '/'
    }

  return (
    <div className="profil-page">
        <div className='profil-container'>
            {ukey && (
                <Block/>
            )}
        </div>
    </div>
  )
}

export default AdminAnAccount