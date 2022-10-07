import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const Card = ({post}) => {
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector((state) => state.userReducer)
  

  return (
    <li className='card-container' key={postMessage.id}>
      {isLoading ? (
        <h3>Chargement...</h3>
      ) : (
        <h2>Test</h2>
      )}
    </li>
  )
}

export default Card