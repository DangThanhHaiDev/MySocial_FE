export const changeTheme = (color) => (dispatch) => {
    localStorage.setItem("theme", color); 
    dispatch({
        type: "CHANGE_THEME",
        payload: color
    });
};
