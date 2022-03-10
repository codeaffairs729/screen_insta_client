import profileTypes from "./profileTypes";

export const INITIAL_STATE = {
    fetching: true,
    following: false,
    fetchingAdditionalPosts: false,
    error: false,
    data: {
        user: undefined,
        followers: [],
        followings: [],
        posts: [],
        followersCount: 0,
        followingsCount: 0,
        postsCount: 0

    },
};

const profileReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case profileTypes.FETCH_PROFILE_START: {
            return {
                ...state,
                //  fetching: true, 
                error: false
            };
        }
        case profileTypes.FETCH_PROFILE_SUCCESS: {
            return {
                ...state,
                fetching: false,
                error: false,
                data: {
                    ...state.data,
                    ...action.payload,
                },
            };
        }

        case profileTypes.FETCH_PROFILE_ERROR: {
            return { ...state, fetching: false, error: action.payload };
        }

        case profileTypes.FETCH_ADDITIONAL_POSTS_START: {
            return {
                ...state,
                fetchingAdditionalPosts: true
            };
        }

        case profileTypes.FETCH_ADDITIONAL_POSTS_SUCCESS: {
            const posts = action.payload;
            return {
                ...state,
                fetchingAdditionalPosts: false,
                error: false,
                data: {
                    ...state.data,
                    // posts: [...state.data.posts, ...posts],
                    posts: posts

                },

            };
        }
        case profileTypes.FETCH_ADDITIONAL_POSTS_ERROR: {
            return {
                ...state,
                fetchingAdditionalPosts: false,
                error: action.payload,
            };
        }
        case profileTypes.SET_POST_VOTES_COUNT: {
            const { postId, votes } = action.payload;
            const posts = JSON.parse(JSON.stringify(state.data.posts));
            const postIndex = posts.findIndex((post) => post._id === postId);
            posts[postIndex].postVotes = votes;

            return {
                ...state,
                data: {
                    ...state.data,
                    posts,
                },
            };
        }
        case profileTypes.INCREMENT_POST_COMMENTS_COUNT: {
            const postId = action.payload;
            const posts = JSON.parse(JSON.stringify(state.data.posts));
            const postIndex = posts.findIndex((post) => post._id === postId);
            posts[postIndex].comments += 1;

            return {
                ...state,
                data: {
                    ...state.data,
                    posts,
                },
            };
        }
        case profileTypes.DECREMENT_POST_COMMENTS_COUNT: {
            const { decrementCount, postId } = action.payload;
            const posts = JSON.parse(JSON.stringify(state.data.posts));
            const postIndex = posts.findIndex((post) => post._id === postId);
            posts[postIndex].comments -= decrementCount;

            return {
                ...state,
                data: {
                    ...state.data,
                    posts,
                },
            };
        }
        case profileTypes.ADD_POSTS: {
            const posts = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    posts: [...state.data.posts, ...posts],
                },
            };
        }
        case profileTypes.DELETE_POST: {
            return {
                ...state,
                data: {
                    ...state.data,
                    posts: state.data.posts.filter((post) => post._id !== action.payload),
                },
            };
        }
        case profileTypes.FOLLOW_USER_START: {
            return { ...state, following: true };
        }
        case profileTypes.FOLLOW_USER_ERROR: {
            return { ...state, following: false, error: action.payload };
        }
        case profileTypes.FOLLOW_USER_SUCCESS: {
            if (action.payload === 'follow') {
                return {
                    ...state,
                    following: false,
                    data: {
                        ...state.data,
                    },
                };
            }
            return {
                ...state,
                following: false,
                data: {
                    ...state.data,
                },
            };
        }
        default: {
            return state;
        }
    }
};

export default profileReducer