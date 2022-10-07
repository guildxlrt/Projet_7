import { GET_USER, UPLOAD_PICTURE, UPDATE_BIRTHDAY, UPDATE_NAMES } from "../actions/user.actions";
import { birthdayFormat, dateFormat } from "../components/utils";


const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {

        case GET_USER :
            return (function () {
                const datas = action.payload
                const birthday = birthdayFormat(datas.birthday)
                const age = dateFormat(datas.birthday)
                const signupDate = dateFormat(datas.signupDate)

                return { ...datas, age : age, signupDate : signupDate, birthday : birthday };
            })()

        case UPLOAD_PICTURE :
            return { ...state, avatarUrl : action.payload}

        case UPDATE_BIRTHDAY :
            return (function () {
                const birthday = birthdayFormat(action.payload)
                const age = dateFormat(action.payload)

                return { ...state, age : age, birthday : birthday };
            })()

        case UPDATE_NAMES :
            const surname = action.payload.surname
            const name = action.payload.name
            return { ...state, surname : surname, name : name }
        
        default :
        return state;
    }
}