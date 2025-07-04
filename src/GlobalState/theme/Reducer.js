const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "LIGHT"
const initState = {
    theme
}

export const themeReducer = (state = initState, action) => {
    switch (action.type) {
        case "CHANGE_THEME":

            return {
                ...state, 
                theme: action.payload
            }

        default:
            return state;
    }
}