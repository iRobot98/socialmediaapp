import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag';

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




function Register(){
    const [values, setValues] = useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    
    
    const onChange = (event)=>setValues({...values, [event.target.name]:event.target.value})
        

    const [addUser, {loading}] = useMutation(REGISTER_USER,{
        update: (proxy, result)=>{
            console.log(result)
        },
        variables: values,
        onError:(error)=>{
            // console.log(error)
            const {graphQLErrors, networkError, name, message} = error
            console.log(`name: ${name}`)
            if(graphQLErrors)console.log(`GrapgQL Error: `,graphQLErrors)
            if(message)console.log(`ApolloError: `,message)
            if(networkError) console.log(`Network Error: \n`,networkError.result.errors)
        }
    })

    

    const onSubmit = async (event)=>{
        event.preventDefault()
        await addUser()
    }

    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading?'loading':''}>
                <h1>Register</h1>
                <Form.Input
                label='Username'
                name='username'
                placeholder="Username..."
                value={values.username}
                onChange={onChange}
                />
                <Form.Input
                label='Email'
                name='email'
                placeholder="Email..."
                value={values.email}
                onChange={onChange}
                />
                <Form.Input
                label='Password'
                name='password'
                type='password'
                value={values.password}
                onChange={onChange}
                
                />
                <Form.Input
                label='Confirm Password'
                name='confirmPassword'
                type='password'
                value={values.confirmPassword}
                onChange={onChange}
                
                />
                <Button type='submit' primary content='Submit' ></Button>
            </Form>
        </div>
    )
}

export default Register;