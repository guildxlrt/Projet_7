import { ALL_USERS } from "../actions/user.actions";
import { birthdayFormat, dateFormat } from "../components/utils";

const initialState = [];

export default function allUsersReducer(state = initialState, action) {
    switch (action.type) {
        
        case ALL_USERS :
            return [
                // recherche l'utilisateur
                ...action.payload.map((user) => {
                    return {
                        ...user,
                        birthday : birthdayFormat(new Date(user.birthday).toISOString().split("T")[0]),
                        age : dateFormat(user.birthday),
                        signupDate : dateFormat(user.signupDate)
                    }
                })
            ]
        
        default :
        return state;
    }
}