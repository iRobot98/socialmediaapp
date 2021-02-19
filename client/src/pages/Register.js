import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks'
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
        onError,
        onSubmit
    } = useForm(registerUser,{
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update: (proxy, result) => {
            // console.log(result)
            props.history.push('/')
        },
        variables: values,
        onError 
    })
    
    function registerUser() {
        addUser()
    }

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

export default Register;