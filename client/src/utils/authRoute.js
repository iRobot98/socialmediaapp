import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import '../App.css';

import { AuthContext,confirmLogin } from '../context/auth'


const AuthRoute = ({component: Component, ...rest}) => {
    const {user} = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render = {props =>
                user ? <Redirect to='/' /> : <Component {...props}/>
            }
        />
    )
}

export default AuthRoute