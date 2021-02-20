import { useQuery } from '@apollo/react-hooks'
import React, { useContext, useState } from 'react'
import { Grid } from 'semantic-ui-react'



import PostForm, {Posts} from '../components/PostForm.js'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../utils/graphQL'


// const getProxyPosts = ()=>{

//     const data = proxy.readQuery({
//         query: FETCH_POSTS_QUERY  
//       })
//     return data.getPosts 
// }





function Home() {
    const { data, loading, error } = useQuery(FETCH_POSTS_QUERY)
    const { user } = useContext(AuthContext)

    
    
    if (error) {
        console.log(error)
        return 'error'
    }

    return (<Grid columns={3} >
        <Grid.Row className='page-title'>
            Recent Posts
      </Grid.Row>
        <Grid.Row>
            {user && (
                <Grid.Column>
                    <PostForm />
                </Grid.Column>
            )}
            {loading && <h1>Loading posts..</h1>}
            {data && <Posts data={data}/>}
        </Grid.Row>
    </Grid>
    )
}



export default Home;