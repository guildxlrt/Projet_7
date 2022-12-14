import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { addPost } from '../../actions/posts.actions'
import { isEmpty } from '../utils'

const NewPost = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [postPicture, setPostPicture] = useState('')
  const [video, setVideo]  = useState('')
  const [file, setFile]  = useState('')
  const userData = useSelector((state) => state.userReducer)

  const [addTitle, setAddTitle] = useState(false)
  const [badTitle, setBadTitle] = useState(false)

  const dispatch = useDispatch()

  const titleTreatment = (title) => {
    let findLink = title.split(" ")
    for (let i = 0; i < findLink.length; i++) {
      if (
        findLink[i].includes(("https://")) ||
        findLink[i].includes(("http://"))
      ) {
        setTitle(title)
        setBadTitle(true)
      }
      else {
        setTitle(title)
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
        setText(findLink.join(" "));
        setPostPicture('');
      }
      else setText(text)
    }
  }

  useEffect(() => {
    if(!isEmpty(userData)) setIsLoading(false)
  }, [userData, title, text, video])

  const handlePicture = (e) => {
    e.preventDefault()

    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo('');
  }
  
  const cancelPost = (e) => {
    e.preventDefault()

    setTitle('')
    setText('')
    setPostPicture('')
    setFile('')
    setVideo('')
  }  
  
  const handlePost = async (e) => {
    e.preventDefault()

    if ((title || text || postPicture || (video !== null)) && !badTitle) {
      const content = new FormData()
      if(title) content.append('title', title)
      if(text) content.append('text', text)
      if(file) content.append('image', file)
      if(video) content.append('video', video)

      dispatch(addPost(content))
      cancelPost(e)

    } else {
      alert("Veuillez remplir une publication.")
    }
  }

  const titleButton = (e) => {
    e.preventDefault()
    setAddTitle(!addTitle)
    if(addTitle) setTitle('')
  }


  return (
    <div className='post-container'>
      {isLoading ? (
        <img src="./images/icons/spinner.svg" alt="spinner" className='load-spinner'/>
      ) : (
        <>
          <div/>
          <NavLink exact to="/profil">
              <div className="user-info">
                <img src={userData.avatarUrl} alt="user-img" />
              </div>

            </NavLink>

            <div className='post-form'>
                  {addTitle ? (
                      <>
                        <div className='title-button'>
                          <button onClick={titleButton}>
                            Enlever le titre
                          </button>
                        </div>
                        <textarea 
                          name="title"
                          id="title"
                          placeholder='Titre'
                          onChange={(e) => {titleTreatment(e.target.value)}}
                          value={title}
                          maxLength="150"
                        />
                      </>
                    ) : (
                      <>
                        <div className='title-button'>
                          <button onClick={titleButton}>
                            Ajouter un titre
                          </button>
                        </div>
                      </>
                    )
                  }
                  
                  <textarea 
                    name="text"
                    id="text"
                    placeholder='Quoi de neuf ?'
                    onChange={(e) => textTreatment(e.target.value)}
                    value={text}
                    maxLength="2000"
                  />


                  {badTitle &&
                    <p className='error'>Le titre ne doit pas contenir de lien</p> 
                  }
                  {(title || text || postPicture || video.length > 20) && (badTitle === false) ? (
                    <li className='card-container'>
                      <div className='card-left'>
                        <img src={userData.avatarUrl} alt="userpic"/>
                      </div>
                      <div className='card-right'>
                        <div className='card-header'>
                          <div  className='pseudo'>
                            <h3>{userData.surname} {userData.name}</h3>
                          </div>
                          <span>A l'instant</span>
                        </div>
                        <div className='content'>
                          <h2>{title}</h2>
                          <p>{text}</p>
                          <img src={postPicture} alt="" />
                          {video && (
                            <iframe
                              src={video}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={video}
                            ></iframe>
                          )}
                        </div>
                        
                      </div>
                    </li>
                  ) : null}
                
                <div className='footer-form'>
                  <div className='icon'>
                    {(isEmpty(video) && !file) && (
                      <>
                        <img src="./images/icons/picture.svg" alt="add-pic"/>
                        <input
                          type="file"
                          id="file-upload"
                          name="file"
                          accept=".jpg,.jpeg,.png,.gif,.webp"
                          onChange={(e) => handlePicture(e)}
                        />
                      </>
                    )}
                    {(video || file) && (
                      <button onClick={() => {
                        setVideo('')
                        setFile('')
                        setPostPicture('')
                      }}>
                        Enlever
                      </button>
                    )}
                </div>

                <div className='btn-send'>
                {title || text || postPicture || video ? (
                  <>
                    <button className="cancel" onClick={cancelPost}>
                      Annuler
                    </button>
                    <button className='send' onClick={handlePost}>
                      Envoyer
                    </button>
                  </>
                ) : null}
                  
                </div>
              </div>

            </div>
        </>
      )}
    </div>
  )
}

export default NewPost