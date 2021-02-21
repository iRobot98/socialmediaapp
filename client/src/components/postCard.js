import React, { useContext, useRef } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import moment from "moment";

import { AuthContext } from '../context/auth'
import { LikeButton, CommentButton, DeleteButton} from './buttons'



export const ButtonShorthand = ({post:{likes, comments, likeCount, commentCount, id, username:postUsername}, inputRef }) => {
    const { user } = useContext(AuthContext)
    //  console.log('ButtonShorthand rendered')
    //  console.log('inputRef:', inputRef)
    
    return (
        <div>
            <LikeButton  post={{id, likes, likeCount}} />
            <CommentButton post={{id, comments, commentCount}} id={id} inputRef={inputRef} />
            {user && user.username === postUsername && <DeleteButton post={{id, postUsername}} />}
            
        </div>
    )

}

const PostCard = ({ post}) => {
    const { id, body, createdAt, username}  = post
    // 
    
    return (
        <Card fluid >
            <Card.Content >
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/post/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonShorthand
                    post={post} postUsername={username} 
                />
                
            </Card.Content>
        </Card>
    )
}

export default PostCard