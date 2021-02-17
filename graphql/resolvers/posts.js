const { AuthenticationError, UserInputError } = require('apollo-server')

const Posts = require('../../models/post.js').PostsModel
const { confirmAuth } = require('../../util/checkAuth')
const { printObject } = require('./utils.js')
const { pubsub } = require('../../pubsub.js')

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                return await Posts.find().sort({ createdAt: -1 });
            } catch (err) {
                console.error(err)
            }
        },

        getPost: async (_, { postId }, __) => {
            try {
                const post = await Posts.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        createPost: async (_, { body }, context) => {
            const user = confirmAuth(context)

            if(body.trim() === ''){
                throw new UserInputError('Post body must not be empty')
            }
            
            const newPost = new Posts({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save();

            pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post
        },

        deletePost: async (_, { postId }, context) => {
            const user = confirmAuth(context);

            try {
                const post = await Posts.findById(postId)
                if (user.username === post.username) {
                    await post.delete();

                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }


            } catch (err) {
                throw err
            }
        },

        likePost: async (_, { postId }, context) => {
            const { username } = confirmAuth(context)

            const post = await Posts.findById(postId)

            if (post) {
                const iLiked = like => like.username === username
                const unLike = like => like.username !== username
                const isLiked = post.likes.find(iLiked)
                if (isLiked) {
                    // Post already liked, so unlike it
                    post.likes = post.likes.filter(unLike)
                } else {
                    // Post not yet liked, so like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }


                return await post.save()
            } else throw new UserInputError('Post not found')
        }
    },

    Subscription: {
        newPost: {
            subscribe: () => pubsub.asyncIterator(['NEW_POST'])

        }
    }
}