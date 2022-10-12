import { ALL_USERS, BLOCK_USER } from "../actions/user.actions";
import { birthdayFormat, dateFormat } from "../components/utils";

const initialState = [];

export default function allUsersReducer(state = initialState, action) {
    switch (action.type) {
        
        case ALL_USERS :
            // pour chaque utilisateur
            return action.payload.map((user) => {
                //formater les dates
                return {
                    ...user,
                    birthday : birthdayFormat(new Date(user.birthday).toISOString().split("T")[0]),
                    age : dateFormat(user.birthday),
                    signupDate : dateFormat(user.signupDate)
                }
            })
        case BLOCK_USER :
            return state.map((user) => {
                // rechercher l'utilisateur
                if (user.id === action.payload.id) {
                    return {
                        ...user,
                        isActive : action.payload.isActive
                    }
                }
                else return user
            })

        default :
        return state;
    }
}