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
  const [addTitle, setAddTitle] = useState()
  const [badTitle, setBadTitle] = useState(false)

  const [postPicture, setPostPicture] = useState(post.imageUrl)
  const [video, setVideo]  = useState(post.video)
  const [file, setFile]  = useState('')

  const [noPic, setNoPic] = useState(false)
  const [noVideo, setNoVideo] = useState(false)

  const date = postTime(post.creationDate)

  const isAuthor = userData.id === post.userId
  
  useEffect(() => {
    !isEmpty(usersList[0]) && setIsLoading(false)

    if(post.title) setAddTitle(true)
    if(!post.title) setAddTitle(false)
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

    setTextUpdate('')
    setTitleUpdate('')
    setFile('')

    if(post.title) setAddTitle(true)
    if(!post.title) setAddTitle(false)

    if (post.imageUrl) setPostPicture(post.imageUrl)
    if (post.video) setVideo(post.video)
    
  }

  const titleTreatment = (title) => {
    let findLink = title.split(" ")
    for (let i = 0; i < findLink.length; i++) {
      if (
        findLink[i].includes(("https://")) ||
        findLink[i].includes(("http://"))
      ) {
        setTitleUpdate(title)
        setBadTitle(true)
      }
      else {
        setTitleUpdate(title)
        setBadTitle(false)
      }
    }
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
        setFile('')
      }
      else setTextUpdate(text)
    }
  }

  const modifyPost = async () => {
    const content = new FormData()
      content.append('text', textUpdate)

      if(titleUpdate) content.append('title', titleUpdate)
      if(addTitle === false) content.append('notitle', true)
      
      if(file) content.append('image', file)
      else if(noPic) content.append('nopic', true)

      if(video) content.append('video', video)
      else if(noVideo) content.append('novideo', true)
      
      const contentList = Array.from(content).length
      if (contentList > 0) {
        dispatch(updatePost(post.id, content))
        .then(() => {
          setIsUpdated(false)
          setTitleUpdate(null)
          setTextUpdate(null)
          setAddTitle(!addTitle)
        })
      }
      else {
        setIsUpdated(false)
        setAddTitle(!addTitle)
      }
  }

  return (
    <li className='card-container' key={postMessage.id}>
      {isLoading ? (
        <img src='./images/icons/spinner.svg' alt="spinner" className='card-spinner'/>
      ) : (
        <>
          <div className='card-left'>
            <Link to={`${
              !isEmpty(usersList[0]) &&
                usersList.map((user) => {
                  if ((user.id === post.userId) && (user.id === userData.id)) {
                    return '/profil'
                  }
                  else if (user.id === post.userId) {
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
                    else if (user.id === post.userId) {
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
                              if ((user.id === post.userId) && (user.id === userData.id)) {
                                return userData.surname +' '+ userData.name
                              }
                              else if (user.id === post.userId) {
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
                    {addTitle ? (
                        <>
                          <button onClick={titleButton}>
                            Enlever le titre
                          </button>
                          <textarea
                            defaultValue={post.title}
                            onChange={(e) => {titleTreatment(e.target.value)}}
                            maxLength="150"
                          />
                        </>
                      ) : (
                        <button onClick={titleButton}>
                          Ajouter un titre
                        </button>
                      )
                    }

                    {badTitle &&
                      <p className='error'>Le titre ne doit pas contenir de lien</p> 
                    }

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
            
            {(isAuthor || (ukey && !isAuthor)) && (
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

            {/* {(ukey && !isAuthor) && (
              <>
                <br/>
                <div className='button-container'>
                  <DeleteCard id={post.id}/>
                </div>
              </>
            )} */}

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