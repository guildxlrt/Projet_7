import { GET_USER, UPLOAD_PICTURE, UPDATE_BIRTHDAY, UPDATE_NAMES } from "../actions/user.actions";

const initialState = {};

const dateFormat = (value) => {
        const time = ((new Date()) - (new Date(value)));
    
        const oneYear = 1000 * 60 * 60 * 24 * 365
        const oneMonth = 1000 * 60 * 60 * 24 * 30
        const oneDay = 1000 * 60 * 60 * 24
    
    
        function newFormat (time, scale) {
            return String(time / scale).split('.')[0]
        }
    
        if (time >= oneYear) {
            return newFormat(time, oneYear) + " ans";
        }
        else if (time >= oneMonth) {
            return newFormat(time, oneMonth) + " mois";
        }
        else if (time >= oneDay) {
            return newFormat(time, oneDay) + " jours";
        }
        else if (time < oneDay) {
            return "Aujourd'hui";
        }
    }

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER :
            return (function () {
                const datas = action.payload

                datas.age = dateFormat(datas.birthday)
                datas.signupDate = dateFormat(datas.signupDate)

                return datas;
            })()

        case UPLOAD_PICTURE :
            return { ...state, avatarUrl : action.payload}
        case UPDATE_BIRTHDAY :
            return { ...state, birthday : action.payload}
        case UPDATE_NAMES :
            const surname = action.payload.surname
            const name = action.payload.name
            return { ...state, surname : surname, name : name }
        
        default :
        return state;
    }
}