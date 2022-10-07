import axios from "axios";

export const GET_POSTS = 'GET_POSTS'

export const getPosts = (uid) => {
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