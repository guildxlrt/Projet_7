import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { getPosts } from '../../actions/posts.actions'
import { isEmpty } from '../utils'
import Card from './Card'
import NewPost from './NewPost'


const Publications = () => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.postsReducer)

  const [loadPage, setLoadPage] = useState(true)
  const [bottomLoad, setBottomLoad] = useState(false)

  const loadNumber = 10
  const [count, setCount] =  useState(loadNumber)


  const loadMore = () => {
    if((window.innerHeight + document.documentElement.scrollTop + 1) > document.documentElement.scrollHeight) {
      setLoadPage(true);
      setBottomLoad(true)
    }
  }

  useEffect(() => {
    if(loadPage) {
      dispatch(getPosts(count))
      setLoadPage(false)
      setBottomLoad(false)
      setCount(count + loadNumber)
    }

    window.addEventListener('scroll', loadMore)
    return () => window.addEventListener('scroll', loadMore)
  }, [loadPage, dispatch, count])

  return (

    <>
      <NewPost/>
      <div className='thread-container'>
        <ul>
          {!(isEmpty(posts[0])) &&
            posts.map((post) => {
              return <Card post={post} key={post.id} />
            }
          )}
        </ul>
        {bottomLoad &&
          <img src='./images/icons/spinner.svg'
            alt="spinner"
            id='bottom-spinner'
          />
        }
      </div>
    </>
    
  )
}

export default Publications