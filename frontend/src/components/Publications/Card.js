import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty, postTime } from '../utils'
import LikeButton from './LikeButton'

const Card = ({post}) => {
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector((state) => state.userReducer)
  const usersList = useSelector((state) => state.allUsersReducer)

  const date = postTime(post.creationDate)
  

  
  useEffect(() => {
    !isEmpty(usersList[0]) && setIsLoading(false)
  }, [usersList])

  return (
    <li className='card-container' key={postMessage.id}>
      {isLoading ? (
        <h3>Chargement...</h3>
      ) : (
        <>
          <div className='card-left'>
            <img src={
              !isEmpty(usersList[0]) &&
                usersList.map((user) => {
                  if (user.id === post.userId) {
                    return user.avatarUrl
                  }
                })
                .join("")
              }
            alt="user-pic"
            />
          </div>
          <div className='card-right'>
              <div className='card-header'>
                <div className='pseudo'>
                  <h3>
                    {
                      !isEmpty(usersList[0]) &&
                        usersList.map((user) => {
                          if (user.id === post.userId) {
                            return user.surname +' '+ user.name
                          }
                        })
                      .join("")
                    }
                  </h3>
                </div>
                
                  <span>{date}</span>
              </div>
              <div>
                <h4>{post.title}</h4>
                {post.text && (
                    <>
                      <br/>
                      <p>{post.text}</p>
                    </>
                )}
              </div>

              {post.imageUrl && (
                <>
                  <br/>
                  <img src={post.imageUrl} alt='card-pic' className='card-pic'/>
                </>
              )}

            {post.video && (
              <iframe
                width="500"
                height="300"
                src={post.video}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={post._id}
              ></iframe>
            )}

            <div className="card-footer">
              <div className="comment-icon">
                <img
                  //onClick={() => setShowComments(!showComments)}
                  src="./images/icons/message1.svg"
                  alt="comment"
                />
                <span>{post.Comment.length}</span>
              </div>
              <LikeButton post={post}/>
              <img src="./images/icons/share.svg" alt="share" />
            </div>

            </div>
        </>
      )}
    </li>
  )
}

export default Card