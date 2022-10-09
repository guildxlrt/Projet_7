import React, { useContext, useEffect, useState } from 'react'
import {UidContext} from "../appContext"
import Popup from 'reactjs-popup'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost } from '../../actions/posts.actions'

const LikeButton = ({post}) => {
  const [liked, setLiked] = useState(false)
  const [isTheAuthor, setIsTheAuthor] = useState(false)
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
    // Si c'est l'auteur du post
    if (post.userId === uid) {
      // on affiche pas le boutton
      setIsTheAuthor(true)
    }
    // Sinon, il s'affiche et...
    else {
      // on cherche si il a deja likec
      post.Like.map((like) => {
        if (like.userId === uid) {
            setLiked(true)
          }
      })
    }
  }, [uid, post.Like, liked])

  return (
    <div className='like-container'>
      {uid === null && (
        <Popup
          trigger={<img src="./images/icons/heart,svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick >
            <div>Connectez-vous pour aimer ce post !</div>
        </Popup>
      )}
      {((uid) && !(isTheAuthor) && (liked === false)) && (
        <img src="./images/icons/heart.svg" onClick={like} alt="like" />
      )}
      {((uid) && !(isTheAuthor) && (liked === true)) && (
        <img src="./images/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
    </div>
  )
}

export default LikeButton