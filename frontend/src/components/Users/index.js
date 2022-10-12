import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isEmpty } from '../utils'
import UserInfos from './UserInfos'

const Users = () => {
    const users = useSelector((state) => state.allUsersReducer)

    const {id} = useParams()


  return (
    <>
        <div className="profil-page">
            <div className='profil-container'>
                {!(isEmpty(users[0])) &&
                    users.map((user) => {
                        if (user.id === Number(id.slice(1))) {
                            return <UserInfos user={user} key={user.id} />
                        }
                })}
            </div>
        </div>
    </>
  )
}

export default Users