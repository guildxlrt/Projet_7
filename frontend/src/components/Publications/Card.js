import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updatePost } from '../../actions/posts.actions'
import { UkeyContext } from '../appContext'
import { isEmpty, postTime } from '../utils'
import Comments from './Comments'
import DeleteCard from './DeleteCard'
import LikeButton from './LikeButton'

const Card = ({post}) => {
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector((state) => state.userReducer)
  const usersList = useSelector((state) => state.allUsersReducer)
  const dispatch = useDispatch()
  const ukey = useContext(UkeyContext)

  const [isUpdated, setIsUpdated] = useState(false)
  const [titleUpdate, setTitleUpdate] = useState(null)
  const [textUpdate, setTextUpdate] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [addTitle, setAddTitle] = useState(false)

  const updateItem = async () => {
    if (
      ((titleUpdate === "") && (textUpdate === ""))
      || ((titleUpdate === null) && (textUpdate === null))
    ) {
      setIsUpdated(false)
    }

    if (titleUpdate || textUpdate) {
      let content = {}

      if (titleUpdate) content.title = titleUpdate
      if (textUpdate) content.text = textUpdate

      dispatch(updatePost(post.id, content))
      .then(() => {
        setIsUpdated(false)
        setTitleUpdate(null)
        setTextUpdate(null)
      })
    }
  }

  const date = postTime(post.creationDate)

  const isAuthor = userData.id === post.userId
  
  useEffect(() => {
    !isEmpty(usersList[0]) && setIsLoading(false)
  }, [usersList])

  const titleButton = (e) => {
    e.preventDefault()
    setAddTitle(!addTitle)
    if(addTitle) setTitleUpdate('')
  }

  const updatePicture = (e) => {
    e.preventDefault()
  }

  return (
    <li className='card-container' key={postMessage.id}>
      {isLoading ? (
        <img src='./images/icons/spinner.svg' alt="spinner" className='card-spinner'/>
      ) : (
        <>
          <div className='card-left'>
            <Link to={`/users/:${
              !isEmpty(usersList[0]) &&
                usersList.map((user) => {
                  if (user.id === post.userId) {
                    return user.id
                  }
                })
                .join("")
              }`}
            >
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
            </Link>
            
          </div>
          <div className='card-right'>
              <div className='card-header'>
                <div className='pseudo'>
                    <h3>
                      {
                        !isEmpty(usersList[0]) &&
                          usersList
                            .map((user) => {
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
                {(post.title && (isUpdated === false)) && (
                  <>
                    <br/>
                    <h2>{post.title}</h2>
                  </>
                )}
                {(post.text && (isUpdated === false)) && (
                  <>
                    <br/>
                    <p>{post.text}</p>
                  </>
                )}
                
                {isUpdated === true && (
                  <div className='update-post'>
                    {!(post.title) && 
                      addTitle ? (
                        <>
                          <button onClick={titleButton}>
                            Enlever le titre
                          </button>
                          <textarea
                            defaultValue={post.title}
                            onChange={(e) => setTitleUpdate(e.target.value)}
                            maxLength="150"
                          />
                        </>
                      ) : (
                        <button onClick={titleButton}>
                          Ajouter un titre
                        </button>
                      )
                    }

                    {post.title && <textarea
                      defaultValue={post.title}
                      onChange={(e) => setTitleUpdate(e.target.value)}
                      maxLength="150"
                    />}
                    <textarea
                      defaultValue={post.text}
                      onChange={(e) => setTextUpdate(e.target.value)}
                      maxLength="2000"
                    />
                    
                    <div className='button-container'>
                      <div className='file-container'>
                        <img src="./images/icons/picture.svg" alt="add-pic"/>
                        <input
                          type="file" 
                          class="file-update"
                          name="file"
                          accept=".jpg,.jpeg,.png,.gif,.webp"
                          onChange={(e) => updatePicture(e)}
                        />
                      </div>
                      <button className='btn' onClick={updateItem}>Valider</button>
                    </div>
                  </div>
                )}
              </div>

              {post.imageUrl && (
                <>
                  <br/>
                  <img src={post.imageUrl}
                    alt='card-pic'
                    className='card-pic'
                  />
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
                title={post.id}
              ></iframe>
            )}
            
            {isAuthor && (
              <>
                <br/>
                <div className='button-container'>
                  <div onClick={(e) => setIsUpdated(!isUpdated)}>
                    {(isUpdated === false) ? (
                      <img src="./images/icons/edit.svg" alt="edit" />
                    ) : (
                      <img src="./images/icons/annul.svg" alt="edit" />
                    )}
                    
                  </div>
                  <DeleteCard id={post.id}/>
                </div>
              </>
            )}

            {(ukey && !isAuthor) && (
              <>
                <br/>
                <div className='button-container'>
                  <DeleteCard id={post.id}/>
                </div>
              </>
            )}

            <div className="card-footer">
              <div className="comment-icon">
                <img
                  onClick={() => setShowComments(!showComments)}
                  src="./images/icons/message1.svg"
                  alt="comment"
                />
                <span>{post.Comment.length}</span>
              </div>
              <LikeButton post={post} />
              <div>
                {post.updated && <span className='updated'>Modifié</span>}
              </div>
              
            </div>
              {showComments && <Comments post={post}/>}
            </div>
        </>
      )}
    </li>
  )
}

export default Card