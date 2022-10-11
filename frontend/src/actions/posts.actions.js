import axios from "axios";

// Posts
export const GET_POSTS = 'GET_POSTS'
export const LIKE_POST = 'LIKE_POST'
export const UNLIKE_POST = 'UNLIKE_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const DELETE_POST = 'DELETE_POST'

// Comments
export const ADD_COMMENT = 'ADD_COMMENT'

export const getPosts = (count) => {
    return async (dispatch) => {
        return await axios({
            method : "get",
            url : `${process.env.REACT_APP_API_URL}/api/posts`,
            withCredentials : true
        })
        .then((res) => {
            const postsList = res.data.reverse().slice(0, count)
            dispatch({type : GET_POSTS, payload : postsList })
        })
        .catch(error => console.log(error))
    }
}

export const likePost = (postId, userId) => {
    return async (dispatch) => {
        return await axios({
            method : "patch",
            url : `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
            withCredentials : true
        })
        .then((res) => dispatch({type : LIKE_POST, payload : {
                datas : res.data,
                postId : postId,
                userId : userId
            }}
        ))
        .catch(error => console.log(error))
    }
}


export const unlikePost = (postId, userId) => {
    return async (dispatch) => {
        return await axios({
            method : "patch",
            url : `${process.env.REACT_APP_API_URL}/api/posts/${postId}/unlike`,
            withCredentials : true
        })
        .then((res) => dispatch({type : UNLIKE_POST, payload : {
                postId : postId,
                userId : userId
            }}
        ))
        .catch(error => console.log(error))
    }
}

export const updatePost = (postId, content) => {
    return async (dispatch) => {
        return await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
            withCredentials : true,
            data : content
        })
        .then(() => dispatch({type : UPDATE_POST, payload : {
                postId : postId,
                content : content
            }}
        ))
        .catch(error => console.log(error))
    }
}

export const deletePost = (postId) => {
    return async (dispatch) => {
        return await axios({
            method : "delete",
            url : `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
            withCredentials : true
        })
        .then(() => dispatch({type : DELETE_POST, payload : postId }
        ))
        .catch(error => console.log(error))
    }
}

export const addComment = (postId, text) => {
    return async (dispatch) => {
        return await axios({
            method : "post",
            url : `${process.env.REACT_APP_API_URL}/api/comments/${postId}`,
            withCredentials : true,
            data : { text : text}
        })
        .then((res) => dispatch({type : ADD_COMMENT, payload : res.data }
        ))
        .catch(error => console.log(error))
    }
}