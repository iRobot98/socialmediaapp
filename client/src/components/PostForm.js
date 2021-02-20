import React, { useState , useRef} from 'react'
import { Grid, Transition, Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'

import { client } from '../apolloprovider'
import PostCard from "../components/postCard.js"
import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY, getPosts_QUERY } from '../utils/graphQL'

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body) ${getPosts_QUERY}
    }
`


const renderPosts = (data) => {
    return data.map((post) => (
        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
            <PostCard post={post}  />
        </Grid.Column>
    ))
}

export let setPosts = () => { }

export function Posts({ }) {
    
    
    const readPosts = () => client.readQuery({
        query: FETCH_POSTS_QUERY
    }).getPosts
    const [data, setPosts_] = useState(readPosts())
    setPosts = () => setPosts_(readPosts())
    return (
        <Transition.Group duration={200}>
            {renderPosts(data)}
        </Transition.Group>
    )
}

const showErrors = (e) => (
    <div className="ui error message" style={{ marginBottom: 20 }}>
        <ul className='list'>
            {e.map(value => (
                <li key={value.message}>{value.message}</li>
            ))}

        </ul>
    </div>

)

const PostForm = (props) => {

    const {
        onChange,
        values,
        error,
        onSubmit
    } = useForm(CREATE_POST_MUTATION, props, {
        body: ''
    }, (proxy, result) => {
        // console.log(result);
        const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
        })

        data.getPosts = [result.data.createPost, ...data.getPosts]

        proxy.writeQuery({
            query: FETCH_POSTS_QUERY, data
        });
        values.body = ''
        setPosts()
    })

    return (
        <>
            <Form onSubmit={onSubmit} >
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder='Mi World'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error != undefined}
                    />
                    <Button type='submit' content='Post' />
                </Form.Field>

            </Form>
            {error && showErrors(error.graphQLErrors)}
        </>
    )
}

export default PostForm