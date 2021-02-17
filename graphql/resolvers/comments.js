const {AuthenticationError, UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Posts = require('../../models/post.js').PostsModel
const { confirmAuth } = require('../../util/checkAuth.js')


module.exports={
    Query:{

    },
    Mutation:{
        createComment: async(_,{postId, body}, context)=>{
            const {username} = confirmAuth(context)
            const errors = {}
            if(body.trim() === ''){
                error.body = 'Comment body must not be empty'
                throw new UserInputError('Empty comment',{
                    errors
                })
            }
            
            const post = await Posts.findById(postId)
            if(post){
                post.comments.unshift({
                    createdAt: new Date().toISOString(),
                    username,
                    body
                })

                await post.save();
                return post;
            }else throw new UserInputError('Post not found')

        },

        deleteComment :async (_, {postId, commentId}, context)=>{
            const {username} = confirmAuth(context)
            
            const post = await Posts.findById(postId)

            if(post){
                const commentIndex =post.comments.findIndex(c => (c.id === commentId &&c.username === username))

                if(commentIndex !== -1){
                    post.comments.splice(commentIndex,1)
                    await post.save()
                    return post;
                }else throw new AuthenticationError('Action not allowed')

            }else throw new UserInputError('Post not found')
        }
    }
}