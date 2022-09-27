import React, { useState } from 'react'
import axios from "axios";

const SignInForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async  (e) => {
    e.preventDefault();
    const loginError = document.querySelector('.error.login')

    await axios({
      method : "post",
      url : `${process.env.REACT_APP_API_URL}api/users/login`,
      withCredentials : true,
      data : {
        email : email,
        password : password
      }
    })
    .then(() => {
      window.location = '/'
    })
    .catch((err) => {
      loginError.innerHTML = err.response.data.error
    })
  }

  return (
    <form action="" onSubmit={handleLogin} id="sign-up-form">
      <label htmlFor="email">Email</label>
      <br/>
      <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <br/>
      <label htmlFor="password">Mot de passe</label>
      <br/>
      <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <br/>
      <input type="submit" value="Se connecter" />
      <br/>
      <div className="error login"></div>
    </form>
  )
}

export default SignInForm