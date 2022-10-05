import { GET_USER, UPLOAD_PICTURE, UPDATE_BIRTHDAY, UPDATE_NAMES } from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER :
            return action.payload
        case UPLOAD_PICTURE :
            return { ...state, avatarUrl : action.payload}
        case UPDATE_BIRTHDAY :
            return { ...state, birthday : action.payload}
        case UPDATE_NAMES :
            return { ...state, ...action.payload}
        default : 
        return state;
    }
}