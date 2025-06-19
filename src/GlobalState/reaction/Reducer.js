const initState = {
    reactions: []
}

export const reactionReducer = (state = initState, action) => {
    switch (action.type) {
        case "GET_REACTION_SUCCESS":

            return {
                ...state, 
                reactions: action.payload
            }

        default:
            return state;
    }
}

