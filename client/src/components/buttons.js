import React, { useContext, useState, useEffect, useRef } from 'react'
import { Button, Confirm } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks'


import { AuthContext, confirmLogin } from '../context/auth'
import { LIKE_POST_MUTATION, DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../utils/graphQL';
import { setPosts } from '../components/PostForm'

function redirToLogin(history) {
    const routeChange = () => {
        let path = `/login`;
        history.push(path);
    }
    return routeChange

}



export const LikeButton = ({ post: { id, likes, likeCount: lkCount } }) => {
    const { user } = useContext(AuthContext)
    const [liked, setLiked] = useState(false)
    const history = useHistory()
    const iLiked = (likes) => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }
    useEffect(() => {
        iLiked(likes)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        onError: () => history.push(`/post/${id}`)
    })
    const [likeCount, setLikeCount] = useState(lkCount)

    const [label, onLike] = useState({
        basic: true,
        color: 'teal',
        pointing: 'left',
        content: `${likeCount}`,
    })
    const LikePost = async () => {
        try {
            const { data: { likePost: { likes, likeCount } } } = await likePost()

            iLiked(likes)
            setLikeCount(likeCount)
            onLike({
                basic: true,
                color: 'teal',
                pointing: 'left',
                content: `${likeCount}`,
            })
        } catch (err) {
            // console.log(err)
        }

    }



    return (
        <Button
            basic={!liked}
            color='teal'
            icon='like'
            label={label}
            onClick={confirmLogin().user  ? (LikePost) : (redirToLogin(history))}
        />
    )
}

const commentOnPost = (history,  id, inputRef) => {
    
    // console.log('CommentOnPost called')
    // console.log('inputRef:', inputRef)
    
    
    const setFocus = ()=>{
        if(inputRef.current) inputRef.current.select()
        
    }
    
    if( history.location.pathname.startsWith('/post/')){
        if(confirmLogin().user) return ()=>history.push(`/login`)
        
        
        return setFocus
    }else return ()=>{
        history.push(`/post/${id}`)
        
    }
}

export const CommentButton = ({ post: { commentCount, id }, inputRef }) => {
    const { user } = useContext(AuthContext)
    const history = useHistory()
    // console.log('CommentButton rendered')
    // console.log('inputRef:', inputRef)
    const hold = useState(useRef())
  
    // useEffect()
    return (<Button
        basic
        color='teal'
        icon={(commentCount < 1) ? ('comment') : ('comments')}
        label={{
            // as: 'a',
            basic: true,
            color: 'teal',
            pointing: 'left',
            content: `${commentCount}`,
        }}
        // onClick={commentOnPost}
        as={Link} to={user ? (`/post/${id}`) : ('/login')}
        onClick={confirmLogin().user  ? (commentOnPost(history, id, inputRef,hold)) : redirToLogin(history)}
    />)

}


export const DeleteButton = ({ post }) => {
    const postId = post.id
    const [confirmOpen, setConfirmOpen] = useState(false)
    const history = useHistory()
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { postId },
        update: (proxy) => {
            setConfirmOpen(false)
            //TODO:remove post from cache
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
    
            data.getPosts = data.getPosts.filter(post => post.id !== postId)
    
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, data
            });
            setPosts()
            history.push('/')
           
        },
        onError: (err) => {
            // console.log(err)
            history.push(`/`)
        }
    })

    
    return (
        <>
            <Button
                as='div'
                color='red'
                icon={'trash'}
                onClick={()=>setConfirmOpen(true)}
                style={{ margin: 0, float: 'right' }}
            />
            <Confirm
            
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmLogin().user  ? deletePost: redirToLogin(history)}
            />
        </>
    )
}

export const PlusButton =(props)=>{
    return (
        <Button
                as='div'
                color='red'
                icon={'add'}
                onClick={()=>{}}
                style={{ marginLeft: 0, float: 'right' }}
            />
    )
}
