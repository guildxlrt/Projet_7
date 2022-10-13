import React, { useContext, useEffect, useState } from 'react'
import {UidContext} from "../appContext"
import Popup from 'reactjs-popup'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost } from '../../actions/posts.actions'

const LikeButton = ({post}) => {
  const [liked, setLiked] = useState(false)
  const uid = useContext(UidContext)
  const dispatch = useDispatch()

  const like = (e) => {
    e.preventDefault()

    dispatch(likePost(post.id, uid))
    .then(() => setLiked (true))
  }

  const unlike = (e) => {
    e.preventDefault()

    dispatch(unlikePost(post.id, uid))
    .then(() => setLiked (false))
  }

  useEffect(()  => {
    // on cherche si il a deja likee
    post.Like.map((like) => {
      if (like.userId === uid) {
          setLiked(true)
        }
    })
  }, [uid, post.Like, liked])

  let count = 0
  for(let like in post.Like) {
    if(post.Like.hasOwnProperty(like)){
      count++;
    }
  }

  const isTheAuthor = (uid === post.userId) ? true : false

  return (
    <div className='like-container'>
      {uid === null && (
        <Popup
          trigger={<img src="./images/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick >
            <div>Connectez-vous pour aimer ce post !</div>
        </Popup>
      )}

      {((uid) && (liked === false) && (!isTheAuthor)) && (
        <img src="./images/icons/heart.svg" onClick={like} alt="like"/>
      )}
      {((uid) && (liked === true) && (!isTheAuthor)) && (
        <img src="./images/icons/heart-filled.svg" onClick={unlike} alt="unlike"/>
      )}
      {(count > 0 && isTheAuthor) && (
        <img src="./images/icons/heart-solid.svg" alt="heart-solid" className='author' />
      )}
      {(count === 0 && isTheAuthor) && (
        <img src="./images/icons/heart.svg" alt="heart" className='author' />
      )}
      <span>{count}</span>
    </div>
  )
}

export default LikeButton