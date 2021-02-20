import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';

import gql from 'graphql-tag';

import {useForm} from '../utils/hooks'

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email:String!
        $password:String!
        $confirmPassword: String!
    ){
        register(
            registerInput:{
                username:$username
                email:$email
                password:$password
                confirmPassword:$confirmPassword
            }
        ){
           id username email createdAt token
        }
    }
`




function Register(props) {
    const {
        onChange,
        values,
        errors,
        showErrors,
        onSubmit,
        loading
    } = useForm(REGISTER_USER,props,{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                    label='Username'
                    name='username'
                    placeholder="Username..."
                    value={values.username}
                    onChange={onChange}
                    error={errors.username != undefined}
                />
                <Form.Input
                    label='Email'
                    name='email'
                    placeholder="Email..."
                    value={values.email}
                    onChange={onChange}
                    error={errors.email != undefined}
                />
                <Form.Input
                    label='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors.password != undefined}
                />
                <Form.Input
                    label='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    value={values.confirmPassword}
                    onChange={onChange}
                    error={errors.password != undefined}
                />
                <Button type='submit' primary content='Submit' ></Button>
            </Form>
            {
                showErrors()
            }
        </div>
    )
}

export default Register;