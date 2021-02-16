const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag');
const mongoose = require('mongoose')

const { Users: UserModel } = require('./models/user.js')

const { MONGODB } = require('./config.js')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('MongoDB Connected'); return server.listen({ port: 5000 }); })
    .then((res) => console.log(`Server running at ${res.url}`))
    .catch((err) => console.error(err))
