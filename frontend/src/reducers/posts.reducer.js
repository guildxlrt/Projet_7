import { GET_POSTS, LIKE_POST, UNLIKE_POST } from "../actions/posts.actions";

const initialState = [];

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        
        case GET_POSTS :
            return action.payload.reverse();

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
        
        default :
        return state;
    }
}