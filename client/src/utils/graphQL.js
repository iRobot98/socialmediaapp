import gql from 'graphql-tag'


export const likes = `likes {
    id username createdAt
}`

export const likeCount = `likeCount`

export const comments = `comments{
    id username createdAt body 
}`

export const getPosts_QUERY = `{
    id body createdAt username likeCount
    ${likes}
    commentCount
    ${comments}
}`

export const FETCH_POSTS_QUERY = gql`
{
    getPosts ${getPosts_QUERY}
}
`

export const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`

export const LIKES_QUERY = gql`
  query getPost($postId:ID!){
      getPost(postId:$postId){
          ${likes}
          ${likeCount}
      }
  }
`

export const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            ${likes}
            ${likeCount}
        }
    }
`

export const GET_POST_QUERY = gql`
query($postId:ID!){
    getPost(postId: $postId)${getPosts_QUERY}
}
`

export const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($commentId:ID! $postId:ID!){
        deleteComment(
            commentId:$commentId 
            postId:$postId
            ){
            likes{
                id username createdAt
            }
            likeCount
            commentCount
            comments{
                id username body createdAt
            }
            
        }
    }
`

export const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID! $body:String!){
        createComment( postId:$postId body:$body ){
            id
            body
            comments{
                id body username createdAt
            }
            likeCount
            likes{
                id username createdAt
            }
        }
    }
`

