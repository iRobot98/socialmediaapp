import {useState} from 'react';

export const useForm = (callBack, initialState = {})=>{
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})

    const onChange = (event) => setValues({ ...values, [event.target.name]: event.target.value })

    const onSubmit = async (event) => {
        event.preventDefault()
        await callBack()
    }

    const onError = (error) => {
        const { graphQLErrors, networkError, name, message } = error
        setErrors(graphQLErrors[0].extensions.exception.errors)
    }

    return {
        onChange,
        onSubmit,
        values,
        errors,
        onError
    };
}
