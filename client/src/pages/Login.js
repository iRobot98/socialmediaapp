import React, { useState} from 'react'
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
        showErrors,
        onSubmit,
        loading
    } = useForm(LOG_IN_USER,props, {
        username: '',
        password: ''
    })


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
                showErrors()
            }
        </div>
    )
}


export default Login;