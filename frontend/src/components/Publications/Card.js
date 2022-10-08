import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { dateFormat, isEmpty } from '../utils'

const Card = ({post}) => {
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector((state) => state.userReducer)
  const usersList = useSelector((state) => state.allUsersReducer)

  const date = dateFormat(post.creationDate)
  const PostDate = () => {
    let part =  null
    if ((date === "Aujourd'hui" )|| (date === "Hier" )) {
      part = ''
    } else {
      part = "Il y a "
    }
    return part + date
  }
  
  useEffect(() => {
    !isEmpty(usersList[0]) && setIsLoading(false)
  }, [usersList])

  return (
    <li className='card-container' key={postMessage.id}>
      {isLoading ? (
        <h3>Chargement...</h3>
      ) : (
        <>
          <div className='card-left'>
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
          </div>
          <div className='card-right'>
              <div className='card-header'>
                <div className='pseudo'>
                  <h3>
                    {
                      !isEmpty(usersList[0]) &&
                        usersList.map((user) => {
                          if (user.id === post.userId) {
                            return user.surname +' '+ user.name
                          }
                        })
                      .join("")
                    }
                  </h3>
                </div>
                
                  <span><PostDate/></span>
              </div>
              <div>
                <h4>{post.title}</h4>
                {post.text && (
                    <>
                      <br/>
                      <p>{post.text}</p>
                    </>
                )}
              </div>

              {post.imageUrl && (
                <>
                  <br/>
                  <img src={post.imageUrl} alt='card-pic' className='card-pic'/>
                </>
              )}
            </div>
        </>
      )}
    </li>
  )
}

export default Card