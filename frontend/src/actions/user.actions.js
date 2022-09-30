import axios from 'axios';

export const GET_USER = "GET_USER";

export const getUser = (uid) => {
    return async (dispatch) => {
        return await axios({
            method : "get",
            url : `${process.env.REACT_APP_API_URL}/api/users/${uid}`,
            withCredentials : true
        })
        .then((res) => {
            dispatch({type : GET_USER, payload : res.data})
        })
        .catch((error) => console.log(error))
    }
}