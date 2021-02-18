import React from 'react'
import { Grid, Image, Transition } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import PostCard from "../components/postCard.js";

const FETCH_POSTS_QUERY = gql`
    {
        getPosts{
            id body createdAt username likeCount
            likes {
                username
            }
            commentCount
            comments{
                id username createdAt body 
            }
        }
    }
`

function Home() {
    const { data, loading, error }  = useQuery(FETCH_POSTS_QUERY)
    // if(!result.loading){
    //     console.log(result.data.getPosts)
    // }
    // if (data) {
    //     console.log(data.getPosts)
    // }
    if(error){
        console.log(error)
        return 'error'
    }

    return (<Grid columns={3} >
        <Grid.Row className='page-title'>
            Recent Posts
      </Grid.Row>
        <Grid.Row>
            {loading && <h1>Loading posts..</h1>}
            {data &&
                  data.getPosts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))}
        </Grid.Row>
    </Grid>
    )
}



export default Home;