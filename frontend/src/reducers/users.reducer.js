import { ALL_USERS } from "../actions/user.actions";

const initialState = [];

export default function allUsersReducer(state = initialState, action) {
    switch (action.type) {
        
        case ALL_USERS :
            const datas = [...action.payload]
            return datas;
        
        default :
        return state;
    }
}