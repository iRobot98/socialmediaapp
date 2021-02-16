const Posts = require('../../models/post.js').PostsModel

 module.exports = {
    Query:{
        getPosts:async()=>{
            try{
                return await Posts.find();
            }catch(err){
                console.error(err)
            }
        }
    },
    Mutation: {
        
    }
}