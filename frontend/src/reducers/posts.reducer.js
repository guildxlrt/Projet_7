import { ADD_COMMENT, ADD_POST, DELETE_COMMENT, DELETE_POST, EDIT_COMMENT, GET_POSTS, LIKE_POST, UNLIKE_POST, UPDATE_POST } from "../actions/posts.actions";

const initialState = [];

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        
        case GET_POSTS :
            return action.payload;

        case ADD_POST :
            return [action.payload.datas, ...state]

        case UPDATE_POST :
            return state.map((post) => {
                //rechercher le post
                if (post.id === action.payload.postId) {
                    // modifier le post
                    return {
                        ...post,
                        ...action.payload.content
                    }
                }
                else return post
            })

        case DELETE_POST :
            return state.filter((post) => post.id !== action.payload )

        case LIKE_POST :
            return state.map((post) => {
                //rechercher le post
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        // ajouter le like
                        Like : [action.payload.datas, ...post.Like]
                    }
                }
                else return post
            })

        case UNLIKE_POST :
            return state.map((post) => {
                //rechercher le post
                if (post.id === action.payload.postId) {
                    return {
                        ...post,
                        // retirer le like
                        Like : post.Like.filter((like) => like.userId !== action.payload.userId )
                    }
                }
                else return post
            })
        
            case ADD_COMMENT :
                return state.map((post) => {
                    //rechercher le post
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            // ajouter le like
                            Comment : [ ...action.payload.datas, ...post.Comment]
                        }
                    }
                    else return post
                })

            case EDIT_COMMENT :
                return state.map((post) => {
                    //rechercher le post
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            Comment : post.Comment.map((comment) => {
                                // rechercher le commentaire
                                if(comment.id === action.payload.id) {
                                    // modifier le commentaire
                                    return {...comment, text : action.payload.text}
                                }
                                else return comment
                            })
                        }
                    }
                    else return post
                })
            
            case DELETE_COMMENT :
                return state.map((post) => {
                    //rechercher le post
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            // retirer le commentaire
                            Comment : post.Comment.filter((comment) => comment.id !== action.payload.id)
                        }
                    }
                    else return post
                })


        default :
        return state;
    }
}