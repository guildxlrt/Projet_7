import axios from "axios";

export const GET_ALL_USERS = "GET_ALL_USERS";

export const getAllUsersReducer = () => {
  return async (dispatch) => {
    return await axios
      .get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then((res) => {
        dispatch({ type: GET_ALL_USERS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};