import { userProps } from "./initialStates/userProps";
import * as actionTypes from "../actions/actionTypes"


const initialState = {
    userProps: userProps
}

export default function userReducer(state = initialState, {type,payload}) {
    switch (type) {
        case actionTypes.LOGIN:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: { ...payload.user },
                    userType: payload.userType,
                    loggedIn: true
                }
            }

        case actionTypes.SIGN_OUT:
            return {
                ...state,
                userProps: {
                    ...state.userProps,
                    user: null, 
                    userType: null, 
                    loggedIn: false, 

                }
            }
            default:
                return state
    }
}