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

  const [postPicture, setPostPicture] = useState(post.imageUrl)
  const [video, setVideo]  = useState(post.video)
  const [file, setFile]  = useState('')

  const [noPic, setNoPic] = useState(false)
  const [noVideo, setNoVideo] = useState(false)

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

    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo('');
  }

  const backButton = (e) => {
    setIsUpdated(!isUpdated)

    setTitleUpdate('')
    setTextUpdate('')

    if (post.imageUrl) setPostPicture(post.imageUrl)
    if (post.video) setVideo(post.video)
    setFile('')
  }

  const textTreatment = (text) => {
    let findLink = text.split(" ");
    for (let i = 0; i < findLink.length; i++) {
      if (findLink[i].includes("https://")) {
        let embed = findLink[i].replace("watch?v=", "embed/");
        setVideo(embed.split("&")[0]);
        findLink.splice(i, 1);
        setTextUpdate(findLink.join(" "));
        setPostPicture('');
      }
      else setTextUpdate(text)
    }
  }

  const modifyPost = async () => {
    
    if (
      (titleUpdate === '' || titleUpdate === null) &&
      (textUpdate === '' || textUpdate === null) &&
      (file === '' || file === null) &&
      (video === null || video === '')
    ) {
      setIsUpdated(false)
    }
    else {
      const content = new FormData()
      if(titleUpdate !== post.title) content.append('title', titleUpdate)
      if(textUpdate !== post.text) content.append('text', textUpdate)
      if(file) content.append('image', file)
      if(video) content.append('video', video)
      
      const contentList = Array.from(content).length
      if (contentList > 0) {
        if(noPic) content.append('nopic', true)
        if(noVideo) content.append('novideo', true)

        dispatch(updatePost(post.id, content))
        .then(() => {
          setIsUpdated(false)
          setTitleUpdate(null)
          setTextUpdate(null)
        })
      }
      else setIsUpdated(false)
    }
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
                      onChange={(e) => textTreatment(e.target.value)}
                      maxLength="2000"
                    />
                    
                    <div className='button-container'>
                      <div className='file-container'>
                        {(!file && !postPicture && !video) &&
                          <>
                            <img src="./images/icons/picture.svg" alt="add-pic"/>
                            <input
                              type="file" 
                              class="file-update"
                              name="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp"
                              onChange={(e) => updatePicture(e)}
                            />
                          </>
                        }
                        {(file && postPicture) && 
                          <>
                            <div onClick={(e) => {
                                setFile('')
                                if(noPic === false) {
                                  setPostPicture(post.imageUrl)
                                }
                                if(noPic === true) {
                                  setPostPicture('')
                                }
                                if(noVideo === false) {
                                  setVideo(post.imageUrl)
                                }
                                if(noVideo === true) {
                                  setVideo('')
                                }
                              }
                            }>
                                Enlever
                            </div>
                          </>
                        }
                        {((postPicture || video) && !file) &&
                          <>
                            <div onClick={(e) => {
                                setNoPic(true)
                                setNoVideo(true)
                                setFile('')
                                setPostPicture('')
                                setVideo('')
                              }
                            }>
                                Retirer
                            </div>
                          </>
                        }
                      </div>
                      <button className='btn' onClick={modifyPost}>Valider</button>
                    </div>
                  </div>
                )}
              </div>

              {(postPicture && !video) && (
                <>
                  <br/>
                  <img src={postPicture}
                    alt='card-pic'
                    className='card-pic'
                  />
                </>
              )}

            {video && (
              <iframe
                width="500"
                height="300"
                src={video}
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
                  <div onClick={backButton}>
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