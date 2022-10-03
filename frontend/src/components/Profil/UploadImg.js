import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uploadPicture } from '../../actions/user.actions';

const UploadImg = () => {

  const [file, setFile] = useState()
  const userData = useSelector((state) => state.userReducer)
  const dispatch = useDispatch();

  const [userPic=userData.avatarUrl, setUserPic] = useState()

  const handlePicture = (e) => {
    e.preventDefault()

    if (file) {
      const data = new FormData()
     data.append('image', file)
      dispatch(uploadPicture(data, userData.id))
    }
  };

  const previewPicture = (e) => {
    e.preventDefault()
    setUserPic(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <div>
      <img src={userPic} alt="user-pic"/>
         
      <form action="" onSubmit={handlePicture} className="upload-pic">
        <label htmlFor='file'>Modifier</label>
        <input type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.gif,.webp"
        onChange={(e) => {
          setFile(e.target.files[0])
          previewPicture(e)
        }} />
        <br />
        <input type="submit" value="Envoyer"></input>
      </form>
    </div>
  )
}

export default UploadImg