import axios from 'axios';

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIRTHDAY = "UPDATE_BIRTHDAY";
export const UPDATE_NAMES = "UPDATE_NAMES"

export const NAMES_ERROR = "NAMES_ERROR"

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
        .catch(error => console.log(error))
    }
}

export const uploadPicture = (file, id) => {
    return async (dispatch) => {
  
        return await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/avatar`,
            withCredentials : true,
            data : file
        })
        .then(async () => {
            return await axios({
                method : "get",
                url : `${process.env.REACT_APP_API_URL}/api/users/${id}`,
                withCredentials : true
            }) 
            .then((res) => {
                dispatch({type : UPLOAD_PICTURE, payload : res.data.avatarUrl})
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    }
}

export const updateBirthday = (birthday, id) => {
    return async (dispatch) => {
        return await axios({
            method : "put",
            url : `${process.env.REACT_APP_API_URL}/api/users/update`,
            withCredentials : true,
            data : {
                birthday : birthday
            }
        })
        .then((res) => {
            dispatch({type : UPDATE_BIRTHDAY, payload : res.data.birthday})
        })
        .catch(error => console.log(error))
    }
}

export const updateNames = (names) => {
    return async (dispatch) => {
        dispatch({type : UPDATE_NAMES, payload : names})
    }
}
