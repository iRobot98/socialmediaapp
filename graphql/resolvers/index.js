const posts = require('./posts.js')
const users = require('./users.js')

module.exports = {
    Query:{
        ...posts.Query,
        ...users.Query
    },
    Mutation:{
        ...users.Mutation,
        ...posts.Mutation
    }
}