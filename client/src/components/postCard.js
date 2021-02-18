import React from 'react'
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import moment from "moment";

// id body createdAt username likeCount
//             likes {
//                 username
//             }
//             commentCount
//             comments{
//                 id username createdAt body 
//             }

function likePost() {
    console.log('Like Post')
}

function commentOnPost(){
    console.log('comment')
}

const ButtonShorthand = ({ likeCount, commentCount }) => (
    <div>
        <Button
            basic
            color='teal'
            // content='Fork'
            icon='like'
            label={{
                // as: 'a',
                basic: true,
                color: 'teal',
                pointing: 'left',
                content: `${likeCount}`,
            }}
            onClick={likePost}

        />
        <Button
            basic
            color='pink'
            // content={(commentCount<1)?('comment'):('comments')}
            icon={(commentCount<1)?('comment'):('comments')}
            label={{
                // as: 'a',
                basic: true,
                color: 'pink',
                pointing: 'left',
                content: `${commentCount}`,
            }}
            onClick={commentOnPost}
        />
    </div>
)

const PostCard = ({ post: { id, body, createdAt, username, likeCount, likes, comments, commentCount } }) => {

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonShorthand likeCount={likeCount} commentCount={commentCount} />
            </Card.Content>
        </Card>
    )
}

export default PostCard