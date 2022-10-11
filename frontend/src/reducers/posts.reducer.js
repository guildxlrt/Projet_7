import { ADD_COMMENT, DELETE_POST, GET_POSTS, LIKE_POST, UNLIKE_POST, UPDATE_POST } from "../actions/posts.actions";

const initialState = [];

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        
        case GET_POSTS :
            return action.payload;

        case LIKE_POST :
            return state.map((post) => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        // ajouter le like
                        Like : [action.payload.datas, ...post.Like]
                    }
                }
                return post
            })

        case UNLIKE_POST :
            return state.map((post) => {
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        // retirer le like
                        Like : post.Like.filter((like) => like.userId !== action.payload.userId )
                    }
                }
                return post
            })
        
        case UPDATE_POST :
            return state.map((post) => {
                if (post.id === action.payload.postId) {
                    
                    return {
                        ...post,
                        ...action.payload.content
                    }
                }
                else return post
            })

            case DELETE_POST :
                return state.filter((post) => post.id !== action.payload )
            
            case ADD_COMMENT :
                return state.map((post) => {
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            // ajouter le like
                            Comment : [ ...action.payload.datas, ...post.Comment]
                        }
                    }
                    return post
                })

        default :
        return state;
    }
}