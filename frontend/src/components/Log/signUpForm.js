// import axios from 'axios'
import React, {useState} from 'react'

const SignUpForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthday, setBirthday] = useState('')

  // const handleRegister = async (e) => {
  //   //
  // }

  return (
    <form action=" onSubmit={handleRegister}" id="sign-up-form">
      <label htmlFor="email">Email</label>
      <br/>
      <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />

      <br/>
      <label htmlFor="password">Password</label>
      <br/>
      <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <br/>


      <label htmlFor="name">Name</label>
      <br/>
      <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} value={name} />
      <br/>

      <label htmlFor="surname">Surname</label>
      <br/>
      <input type="text" name="surname" id="surname" onChange={(e) => setSurname(e.target.value)} value={surname} />
      <br/>

      <label htmlFor="birthday">Date de naissance</label>
      <br/>
      <input type="date" name="birthday" id="birthday" onChange={(e) => setBirthday(e.target.value)} value={birthday} />
      <br/>

      <input type="submit" value="Valider inscription" />
    </form>
  )
}

export default SignUpForm