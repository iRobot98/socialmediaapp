import moment from "moment"
import React, { useContext, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Confirm, Form, Card, Transition, Input } from 'semantic-ui-react'
import { useMutation } from '@apollo/client';


import { client } from '../apolloprovider'
import { AuthContext } from '../context/auth'
import { useForm } from '../utils/hooks'
import { DELETE_COMMENT_MUTATION, CREATE_COMMENT_MUTATION, GET_POST_QUERY } from '../utils/graphQL'

import { confirmLogin } from '../context/auth'


let refreshComments = () => { }

function redirToLogin(history) {
    const routeChange = () => {
        let path = `/`;
        history.push(path);
    }
    return routeChange

}

function DeleteComment({ postId, commentId }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const history = useHistory()
    // console.log(DELETE_COMMENT_MUTATION)
    // console.log(postId, commentId)
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: { postId, commentId },
        update: (proxy, result) => {
            setConfirmOpen(false)
            try{
                const data = proxy.readQuery({
                    query: GET_POST_QUERY,
                    variables: { postId }
                })
                
                const filterFn = (c) => (c.id !== commentId)
                // console.log(data)
                data.getPost.comments = data.getPost.comments.filter(filterFn)
                proxy.writeQuery({
                    query: GET_POST_QUERY, data
                })
                refreshComments()
            }catch(err){
                // console.log(err)
            }
            
            // history.push(`/post/${postId}`)
        },
        client,
        onError: (err) => {
            
            // console.log('error')
            // console.log(err)
        }
    })
    // const delComment = async()=>{
    //     const d= await deleteComment()
    //     // console.log(d)
    //     return d
    // }

    return (
        <>
            <Button
                as='div'
                color='red'
                icon={'trash'}
                onClick={() => setConfirmOpen(true)}
                style={{ margin: 0, float: 'right' }}
            />
            <Confirm

                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmLogin().user ? deleteComment : redirToLogin(history)}
            />
        </>
    )
}

export function Comments({ post,  inputRef }) {
    const sortComments = (cmmnts)=>{
        return cmmnts.sort((a, b)=>{
            return  moment(b.createdAt) - moment(a.createdAt)
        })
    }
    // console.log('Comments rendered')
    // console.log('inputRef:', inputRef)
    const { comments: cmnts, id } = post
    const { user } = useContext(AuthContext)
    const [comments, setComments] = useState(sortComments(cmnts))
    

    refreshComments = () => {
        const comments = client.readQuery({
            query: GET_POST_QUERY,
            variables: { postId: post.id }
        }).getPost.comments
        // console.log(comments)
        
        return setComments(sortComments(comments))
    }
    // refreshComments()
    return (
        <div>
            <Transition.Group duration={200}>
            <CommentForm post={post} inputRef={inputRef} />
            {comments && comments.map(c => (
                <Card fluid key={c.id}>
                    <Card.Content>
                        <Card.Header>{c.username}</Card.Header>
                        <Card.Meta >{moment(c.createdAt).fromNow(true)}</Card.Meta>
                        <Card.Description>
                            {c.body}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {/* <ButtonShorthand post={postData}/> */}
                        {user && user.username === c.username && <DeleteComment
                            postId={id} commentId={c.id}
                        />}
                    </Card.Content>
                </Card>
            
            ))}
            </Transition.Group>
        </div>
    )
}

const showErrors = (e) => (
    <div className="ui error message" style={{ marginBottom: 20 }}>
        <ul className='list'>
            {e && e.map(value => (
                <li key={value.message}>{value.message}</li>
            ))}

        </ul>
    </div>

)

const CommentForm = (props) => {
    let inputRef = props.inputRef
    // console.log('CommentForm rendered')
    // console.log('inputRef:', inputRef)
    const postId = props.post.id
    const history = useHistory()
    
    
    // console.log(postId)
    // console.log(props)
    // console.log(CREATE_COMMENT_MUTATION)
    const {
        onChange,
        values,
        error,
        onSubmit
    } = useForm(CREATE_COMMENT_MUTATION, props, {
        postId,
        body: ''
    }, (proxy, result) => {
        // console.log(result);
        const data = proxy.readQuery({
            query: GET_POST_QUERY,
            variables: values
        })

        data.getPost.comments.unshift(result.data.createComment)

        proxy.writeQuery({
            query: GET_POST_QUERY, data
        });
        values.body = ''
        refreshComments()
        // inputRef.current.blur()
    })
    

    return (confirmLogin().user &&
        <>
            <Form onSubmit={onSubmit}   >
            {/* {// console.log('Form rendered'),
    // console.log('inputRef:', inputRef)} */}
                <h4 style={{ marginBottom: '1rem' }}>Comment</h4>
                <Form.Field >
                    <Input
                        style={{marginBottom:20}}
                        placeholder='Comment...'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error != undefined}
                        
                                ref={inputRef}               
                    />
                     {/* { console.log('Input rendered'), 
    // console.log('inputRef:', inputRef)} */}
                    <Button type='submit' content='Comment' />
                </Form.Field>

            </Form>
            {/* {// console.log('After Form rendered'),
    // console.log('ref:', ref2)} */}
            {error && error.graphQLErrors && showErrors(error.graphQLErrors)}
        </>
    )
}

export default Comments
