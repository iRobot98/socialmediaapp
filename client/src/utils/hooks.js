import { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks'

import { AuthContext } from '../context/auth'
import { client } from '../apolloprovider'

export const useForm = (MUTATION, props, initialState = {}, update = undefined) => {
    const context = useContext(AuthContext)
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})

    const onChange = (event) => setValues({ ...values, [event.target.name]: event.target.value })

    const onSubmit = async (event) => {
        event.preventDefault()
        await Mutate()
    }

    const onError = (error) => {
        const { graphQLErrors, networkError, name, message } = error
        //    if (graphQLErrors) setErrors(graphQLErrors[0].extensions.exception.errors)
        console.log(error)
        if (graphQLErrors.length >= 1) setErrors(graphQLErrors[0].extensions.exception.errors)
        if (networkError) console.log(networkError)
        console.log(message)
    }

    update = update ? update : (proxy, { data: { login: userData } }) => {
        // console.log(result)
        context.login(userData)
        props.history.push('/')
    }

    const [mutation, { error, loading }] = useMutation(MUTATION, {
        update,
        client,
        variables: values,
        onError
    })

    function Mutate() {
        mutation()
    }

    const showErrors = () => {
        return (
            errors && Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className='list'>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )
        )
    }

    return {
        onChange,
        onSubmit,
        values,
        errors,
        error,
        showErrors,
        loading
    };
}
