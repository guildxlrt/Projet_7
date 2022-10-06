import { NAMES_ERROR } from "../actions/user.actions";

const initialState = {};

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case NAMES_ERROR :
            return action.payload
    
        default:
            return state;
    }
}