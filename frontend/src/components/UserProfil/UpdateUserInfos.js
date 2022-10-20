import React from 'react'
import { useSelector } from 'react-redux';
import { isEmpty } from '../utils';
import UpdateBirthday from './UpdateBirthday'
import UpdateNames from './UpdateNames';

const UpdateUserInfos = () => {
    const userData = useSelector((state) => state.userReducer)
    const posts = useSelector((state) => state.postsReducer)

    return (
        <div className='right-part'>
            <h2>Informations Personnelles</h2>
            <UpdateNames/>
            <UpdateBirthday/>
            <h4>{userData.email}</h4>
            <h4>{!(isEmpty(posts[0])) &&
                    posts.filter(post => post.userId === userData.id).length
                } Publication(s)
            </h4>
            <h4>Inscrit depuis {userData.signupDate}</h4>

        </div>
    )
}

export default UpdateUserInfos