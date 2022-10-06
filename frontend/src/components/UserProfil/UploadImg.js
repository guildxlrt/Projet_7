import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uploadPicture } from '../../actions/user.actions';

const UploadImg = () => {
  const [file, setFile] = useState()
  const userData = useSelector((state) => state.userReducer)
  const dispatch = useDispatch();

  const [userPic=userData.avatarUrl, setUserPic] = useState()

  const [undo, setUndo] = useState(false)


  const previewPicture = (e) => {
    e.preventDefault()
    setUserPic(URL.createObjectURL(e.target.files[0]))
    setUndo(true)
  };

  const removeFile = (e) => {
    e.preventDefault()

    setFile(null)
    document.getElementById('file').value = "";
    setUserPic(userData.avatarUrl)
    setUndo(false)
  };

  const defaultImg = (e) => {
    e.preventDefault()
    
    //envoyer des donnees
    const data = new FormData()
    data.append('image', null)
    dispatch(uploadPicture(data, userData.id))

    // rafraichissement de linterface
    setFile(null)
    setUserPic("./images/random-user.png")
    document.getElementById('file').value = "";
  }

  const handlePicture = (e) => {
    e.preventDefault()

    if (file) {
      //envoyer les donnees
      const data = new FormData()
      data.append('image', file)
      dispatch(uploadPicture(data, userData.id))
      // rafraichissement de linterface
      setUserPic(URL.createObjectURL(file))
      setUndo(false)
      document.getElementById('file').value = "";
      setFile(null)
    }
  };

  return (
    
    <div className='left-part'>
      <h2>Photo de profil</h2>

      <div className='avatar'>
        <img src={userPic} alt="user-pic"/>  
        <form action="" onSubmit={handlePicture} className="upload-pic">
          <label htmlFor='file'>Modifier</label>
          <input type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={(e) => {
            setFile(e.target.files[0])
            previewPicture(e)
          }} />
          <br />
          {file && (
            <>
              <br/>
              <input className='pic-button' type="submit" value="Envoyer"></input>
            </>
          )}
        </form>
        {undo === true && (
          <>
            <br/>
            <button className='pic-button' onClick={removeFile} >Annuler</button>
          </>
        )}
        {!(userData.avatarUrl === "./images/random-user.png") && (
          undo === false && (
            <>
              <br/>
              <button className="del-button" onClick={defaultImg} >Supprimer</button>
            </>
          )
        )}
      </div>
    </div>
  )
}

export default UploadImg