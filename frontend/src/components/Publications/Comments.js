import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addComment, getPosts } from '../../actions/posts.actions'
import { isEmpty, postTime } from '../utils'
import EditDeleteComment from './EditDeleteComment'

const Comments = ({post}) => {
    const userData = useSelector((state) => state.userReducer)
    const usersList = useSelector((state) => state.allUsersReducer)
    const dispatch = useDispatch()

    const [text, setText] = useState('')

    const handleComment = (e) => {
        e.preventDefault()
        if(text) {
            dispatch(addComment(post.id, text))
            .then(() => dispatch(getPosts()))
            .then(() => setText(''))
        }
    }

    return (
        <div className='comments-container'>
            {!isEmpty(post.Comment) && post.Comment.map((comment) => {
                return (
                    <div className={(comment.userId === userData.id) ?
                        "comment-container client" : "comment-container"}
                        key={comment.id}
                    >
                        <div className='left-part'>
                            <Link to={`${
                                !isEmpty(usersList[0]) &&
                                    usersList.map((user) => {
                                    if ((user.id === comment.userId) && (user.id === userData.id)) {
                                        return '/profil'
                                    }
                                    else if (user.id === comment.userId) {
                                        return '/users/:' + user.id
                                    }
                                    })
                                    .join("")
                                }`}
                                >
                                <img src={
                                    !isEmpty(usersList[0]) &&
                                    usersList.map((user) => {
                                        if ((user.id === post.userId) && (user.id === userData.id)) {
                                        return userData.avatarUrl
                                        }
                                        else if (user.id === comment.userId) {
                                        return user.avatarUrl
                                        }
                                    })
                                    .join("")
                                    }
                                alt="user-pic"
                            />
                            </Link>
                        </div>
                        <div className='right-part'>
                            <div className='comment-header'>
                                <div className='pseudo'>
                                    <h3>{!isEmpty(usersList[0]) &&
                                            usersList
                                                .map((user) => {
                                                    if (user.id === comment.userId) {
                                                        return user.surname +" "+ user.name
                                                    }
                                                })
                                    }</h3>
                                </div>
                                <span>{postTime(comment.date)}</span>
                            </div>
                            <p>{comment.text}</p>
                            <EditDeleteComment comment={comment}/>
                        </div>
                    </div>
                )
            })}
            {userData.id && (
                <form action="comment-form" onSubmit={handleComment} className="comment-form">
                    <input
                        type="text"
                        name="text"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        placeholder="Laisser un commentaire" maxLength="500"
                    />
                    <br/>
                    <input type="submit" value="Envoyer" />
                </form>
            )}
        </div>
    )
}

export default Comments