import {combineReducers} from 'redux'
import userReducer from './user.reducer'
import postsReducer from './posts.reducer'
import allUsersReducer from './users.reducer'

export default combineReducers({
    userReducer,
    postsReducer,
    allUsersReducer
})