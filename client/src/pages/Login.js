import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks'

const LOG_IN_USER = gql`
    mutation login(
        $username: String!
        $password:String!
    ){
        login(
            username:$username
            password:$password
        ){
           id username email createdAt token
        }
    }
`




function Login(props) {
    const {
        onChange,
        values,
        errors,
        onError,
        onSubmit
    } = useForm(LoginUser, {
        username: '',
        password: ''
    })

    const [loginUser, { loading }] = useMutation(LOG_IN_USER, {
        update: (proxy, result) => {
            // console.log(result)
            props.history.push('/')
        },
        variables: values,
        onError
    })

    function LoginUser() {
        loginUser()
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Log In</h1>
                <Form.Input
                    label='Username'
                    name='username'
                    placeholder="Username..."
                    value={values.username}
                    onChange={onChange}
                    error={errors.username != undefined}
                />
                <Form.Input
                    label='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors.password != undefined}
                />
                <Button type='submit' primary content='Log In' ></Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className='list'>
                            {Object.values(errors).map(value => (
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}


export default Login;