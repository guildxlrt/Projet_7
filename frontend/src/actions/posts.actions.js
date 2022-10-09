import axios from "axios";

export const GET_POSTS = 'GET_POSTS'
export const LIKE_POST = 'LIKE_POST'
export const UNLIKE_POST = 'UNLIKE_POST'


export const getPosts = () => {
    return async (dispatch) => {
        return await axios({
            method : "get",
            url : `${process.env.REACT_APP_API_URL}/api/posts`,
            withCredentials : true
        })
        .then((res) => {
            dispatch({type : GET_POSTS, payload : res.data})
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
        .then((res) => dispatch({
            type : LIKE_POST,
            payload : {
                datas : res.data, 
                    postId : postId,
                    userId : userId
                }
            }
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
        .then(() => dispatch({
            type : UNLIKE_POST,
            payload : {
                    postId : postId,
                    userId : userId
                }
            }
        ))
        .catch(error => console.log(error))
    }
}