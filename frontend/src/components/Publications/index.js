import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { getPosts } from '../../actions/posts.actions'
import { isEmpty } from '../utils'
import Card from './Card'


const Publications = () => {
  const [loadPost, setLoadPost] = useState(true)
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.postsReducer)

  useEffect(() => {
    if(loadPost) {
      dispatch(getPosts())
      setLoadPost(false)
    }
  }, [loadPost, dispatch])


  return (
    <div className='thread-container'>
        <ul>
          {!(isEmpty(posts[0])) &&
            posts.map((post) => {
              return <Card post={post} key={post.id} />
            })}
        </ul>

    </div>
  )
}

export default Publications