import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode';

export const confirmLogin = () => {

    const initialState = {
        user: null
    }


    let token = localStorage.getItem('jwtToken')

    if (token) {
        const decodedToken = jwtDecode(token)
        const expiration = (decodedToken.exp * 1000)
        if (expiration < Date.now()) {
            localStorage.removeItem('jwtToken')
        } else {
            initialState.user = decodedToken;
        }
    }

    return initialState
}

const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { }
})

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }

        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state
    }

}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, confirmLogin())

    const login = (userData) => {
        localStorage.setItem("jwtToken", userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }
    const logout = () => {
        localStorage.removeItem("jwtToken")
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }