import { GET_USER, UPLOAD_PICTURE, UPDATE_BIRTHDAY, UPDATE_NAMES, NAMES_ERROR } from "../actions/user.actions";

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
            const surname = action.payload.surname
            const name = action.payload.name
            return { ...state, surname : surname, name : name }


        case NAMES_ERROR :
            return {...state, error : action.payload}
        
        default :
        return state;
    }
}