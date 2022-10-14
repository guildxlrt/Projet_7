// import axios from 'axios'
import React, {useState} from 'react'
import axios from 'axios'

const SignUpForm = () => {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthday, setBirthday] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passConfirm, setPassConfirm] = useState('')

  const [file, setFile] = useState()
  const [userPic, setUserPic] = useState("./images/random-user.png")

  const removeFile = (e) => {
    e.preventDefault()

    setFile(null)
    setUserPic("./images/random-user.png")
  }

  const handlePicture = (e) => {
    e.preventDefault()
    setUserPic(URL.createObjectURL(e.target.files[0]))
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    const surnameError = document.querySelector('.error.surname')
    const nameError = document.querySelector('.error.name')
    const emailError = document.querySelector('.error.email')
    const passwordError = document.querySelector('.error.password')
    const passwordConfError = document.querySelector('.error.passConfirm')
    const dateError = document.querySelector('.error.date')

    
    const terms = document.getElementById('terms')
    const termsError = document.querySelector('.error.terms')

    termsError.innerHTML = "";
    surnameError.innerHTML = "";
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    passwordConfError.innerHTML = "";
    dateError.innerHTML = "";

    const datas = new FormData()
    datas.append('surname', surname)
    datas.append('name', name)
    datas.append('birthday', birthday)
    datas.append('email', email)
    datas.append('password', password)
    datas.append('passConfirm', passConfirm)
    

    if (file) {
      datas.append('image', file)
    }

    //console.log(Array.from(datas))

    if (!terms.checked) {
      termsError.innerHTML = "Veuillez remplir les conditions generales" 
    } else {
      await axios({
        method : "post",
        url : `${process.env.REACT_APP_API_URL}/api/users/signup`,
        withCredentials : true,
        data : datas
      })
      .then(() => {
        window.location = '/'
      })
      .catch((err) => {
        console.log(err)
        const error =  err.response.data.error
        if (error.surname) {surnameError.innerHTML = error.surname}
        if(error.name) {nameError.innerHTML = error.name}
        if(error.email) {emailError.innerHTML = error.email}
        if(error.password) {passwordError.innerHTML = error.password}
        if(error.passConfirm) {passwordConfError.innerHTML = error.passConfirm}
        if(error.date) {dateError.innerHTML = error.date}
        if(error.legal_age) {dateError.innerHTML = error.legal_age}
      })
    }
  }

  return (
    <div>
        <div className='new-user-pic'>
          <img alt="user-pic" src={userPic}/>
          
          <form action="" onSubmit={handlePicture} className="upload-pic">
            {file ? (
              <button className="signup-input-del-img" onClick={removeFile}>Enlever</button>
            ) : (
              <label className="signup-input-add-img" htmlFor='file'>Ajouter</label>
            )}
            <input className="signup-input-file" type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.gif,.webp"
            onChange={(e) => {
              setFile(e.target.files[0])
              handlePicture(e)
            }} />
          </form>
        </div>


        <br/>
        <br/>
        <form action="" onSubmit={handleRegister} id="sign-in-form">      
          <label htmlFor="surname">Prenom</label>
          <br/>
          <input type="text" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} value={surname} />
          <br/>
          <div className="error surname"></div>

          <label htmlFor="name">Nom</label>
          <br/>
          <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} />
          <br/>
          <div className="error name"></div>

          <label htmlFor="birthday">Date de naissance</label>
          <br/>
          <input type="date" name="birthday" id="birthday" onChange={(e) => setBirthday(e.target.value)} value={birthday} />
          <br/>
          <div className="error date"></div>



          <label htmlFor="email">Email</label>
          <br/>
          <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          <br/>
          <div className="error email"></div>


          <label htmlFor="password">Mot de passe</label>
          <br/>
          <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          <br/>
          <div className="error password"></div>

          <label htmlFor="passConfirm">Confirmation</label>
          <br/>
          <input type="password" name="passConfirm" id="passConfirm" onChange={(e) => setPassConfirm(e.target.value)} value={passConfirm} />
          <br/>
          <div className="error passConfirm"></div>
          

          <input type="checkbox" id="terms" />
          <label htmlFor='terms'>J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">condition generales</a></label>
          <div className="error terms"></div>
          <input type="submit" value="Valider inscription" />
          
        </form>
      </div>
  )
}

export default SignUpForm