import { useQuery } from '@apollo/react-hooks'
import moment from "moment"
import React, { useContext, useState, useRef } from 'react'
import { Link ,useHistory} from 'react-router-dom';
import { Button, Confirm } from 'semantic-ui-react'


import { client } from '../apolloprovider'
import { AuthContext } from '../context/auth'
import { Card, Grid, Image } from 'semantic-ui-react'
import { GET_POST_QUERY, DELETE_COMMENT_MUTATION } from '../utils/graphQL'
import { ButtonShorthand } from '../components/postCard'
import { useMutation } from '@apollo/client';
import {confirmLogin} from '../context/auth'
import Comments from '../components/commentForm'



function redirToLogin(history) {
    const routeChange = () => {
        let path = `/`;
        history.push(path);
    }
    return routeChange

}

const Post = ({ postData }) => {
    const { id, body, username, createdAt } = postData
    
    
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={2}>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    />
                </Grid.Column>
                <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta as={Link} to={`/post/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                            <Card.Description>
                                {body}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <ButtonShorthand post={postData} />
                        </Card.Content>
                    </Card>
                    <Comments post={postData}  />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}


function SinglePost(props) {

    const params = props.match.params
    const postId = params.postId
    const { loading, data, error } = useQuery(GET_POST_QUERY, {
        variables: { postId }
    })
    const { user } = useContext(AuthContext)
    const history = useHistory()

    const getPost = () => {
        const postData = data.getPost
        return <Post postData={postData} />
    }

    return (
        <>
            {loading && (<div className='loading'></div>)}
        {error && redirToLogin(history)}
            {data && getPost()}
        </>
    )
}

export default SinglePost