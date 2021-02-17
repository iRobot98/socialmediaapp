const posts = require('./posts.js')
const users = require('./users.js')
const comments = require('./comments.js')

module.exports = {
    Query:{
        ...posts.Query,
        ...users.Query,
        ...comments.Query
    },
    Mutation:{
        ...users.Mutation,
        ...posts.Mutation,
        ...comments.Mutation
    }
}