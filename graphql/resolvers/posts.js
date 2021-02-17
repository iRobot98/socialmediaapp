const {AuthenticationError} = require('apollo-server')

const Posts = require('../../models/post.js').PostsModel
const { confirmAuth } = require('../../util/checkAuth')

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                return await Posts.find().sort({createdAt: -1});
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

            const newPost = new Posts({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

           
            return await newPost.save();
        },

        deletePost: async(_,{postId}, context)=>{
            const user = confirmAuth(context);

            try {
                const post = await Posts.findById(postId)
                if(user.username === post.username){
                    await post.delete();

                    return 'Post deleted successfully'
                }else{
                    throw new AuthenticationError('Action not allowed')
                }


            } catch (err) {
                throw err
            }
        }
    }
}