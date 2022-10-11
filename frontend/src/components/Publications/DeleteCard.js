import React from 'react'
import { useDispatch } from 'react-redux'
import { deletePost } from '../../actions/posts.actions'

const DeleteCard = ({id}) => {
    const dispatch = useDispatch()

    const deleteQuote = () => dispatch(deletePost(id))

  return (
    <div onClick={() => {
        if(window.confirm("Voulew vous supprimer cette publication ?")) {
            deleteQuote()
        }
    }}>
        <img src="./images/icons/trash.svg" alt="edit" />
    </div>
  )
}

export default DeleteCard