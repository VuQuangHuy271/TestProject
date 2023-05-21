const express = require('express');
const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./src/schema/Cook')
const resolvers = require('./src/resolver/resolverCook')

const app = express()
let  = null;
async function startServer() {
    server = new ApolloServer({
        typeDefs, resolvers
    })
    await server.start();

    server.applyMiddleware({app})
    
}

startServer();

app.listen({ port: 4000}, () => {
    console.log("Successful")
})

    

