import { createSelector } from 'reselect';


export const selectProfileState = createSelector(
    [(state) => state.profile],
    (profile) => profile
);

export const selectProfileUser = createSelector(
    [(state) => state.profile],
    (profile) => profile.data.user
)
export const selectProfilePosts = createSelector(
    [(state) => state.profile],
    (profile) => profile.data.posts
)


