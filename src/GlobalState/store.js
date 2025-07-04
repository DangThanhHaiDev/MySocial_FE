import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import {thunk} from "redux-thunk";
import { AuthReducer } from "./auth/Reducer";
import { reactionReducer } from "./reaction/Reducer";
import { themeReducer } from "./theme/Reducer";


const rootReducer = combineReducers({
    auth: AuthReducer,
    reaction: reactionReducer,
    theme: themeReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
