import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, getPosts } from '../../actions/posts.actions'
import { isEmpty, postTime } from '../utils'

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
                    <div className={comment.userId === userData.id ?
                        "comment-container client" : "comment-container"}
                        key={comment.id}
                    >
                        <div className='left-part'>
                        <img src={
                            !isEmpty(usersList[0]) &&
                                usersList
                                    .map((user) => {
                                    if (user.id === comment.userId) {
                                        return user.avatarUrl
                                    }
                                    })
                                    .join("")
                            }
                            alt="commenter-pic"
                            />
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
                        </div>
                    </div>
                )
            })}
            {userData.id && (
                <form action="comment-form" onSubmit={handleComment} className="comment-form">
                    <input type="text" name="text"onChange={(e) => setText(e.target.value)} value={text} placeholder="Laisser un commentaire" />
                    <br/>
                    <input type="submit" value="Envoyer" />
                </form>
            )}
        </div>
    )
}

export default Comments