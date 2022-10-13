import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteComment, editComment } from '../../actions/posts.actions'
import { UidContext, UkeyContext } from '../appContext'

const EditDeleteComment = ({comment}) => {
    const [isAuthor, setIsAuthor] = useState(false)
    const [edit, setEdit] = useState(false)
    const [text, setText] = useState('')
    const uid = useContext(UidContext)
    const ukey = useContext(UkeyContext)
    const dispatch = useDispatch()

    const handleEdit = (e) => {
        e.preventDefault()

        if(text) {
            dispatch(editComment(comment.id, text))
            setText('')
            setEdit(false)
        }
        else setEdit(false)
    }

    const handleDelete = () => {
        console.log(1111);

        dispatch(deleteComment(comment.id, comment.postId))
    } 

    useEffect(() => {
        if(uid === comment.userId) {
            setIsAuthor(true)
        }
    }, [uid, comment.userId])

  return (
    <div className='edit-comment'>
        { (isAuthor || ukey ) && <div>
            <span onClick={() => {
                    if (
                        window.confirm("Voulez-vous supprimer ce commentaire ?")
                        ) {
                            handleDelete()
                        }
                }}
            >
                <img src="./images/icons/trash.svg" alt="trash" />
            </span>
        </div>}
        {(isAuthor && (edit === false)) && (
            <span onClick={() => setEdit(!edit)}>
                <img src="./images/icons/edit.svg" alt="edit-comment" />
            </span>
            
        )}
        {(isAuthor && (edit === true)) && (
            <form action='' onSubmit={handleEdit} className='edit-comment-form'>
                <label htmlFor='text' onClick={() => setEdit(!edit)} >
                    <img src="./images/icons/annul-circle.svg" alt="annul" />
                </label>
                <br/>
                <input type='text' name="text" onChange={(e) => setText(e.target.value)} defaultValue={comment.text} />
                <br/>
                <input type='submit' value='Valider' />
                
            </form>
        )}
        
    </div>
  )
}

export default EditDeleteComment