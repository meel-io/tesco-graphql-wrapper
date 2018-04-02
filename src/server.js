require('dotenv').config()
const { GraphQLServer } = require('graphql-yoga')
const { ApolloEngineLauncher } = require('apollo-engine')
const { typeDefs, resolvers } = require('./schema')

const engineKey = process.env.APOLLO_ENGINE_KEY
const port = process.env.PORT || 4000
const frontendPort = process.env.APOLLO_PORT || 3000
const endpoint = process.env.ENDPOINT || '/'

const server = new GraphQLServer({ typeDefs, resolvers })

server.start({ port, cacheControl: true }, () =>
  console.log(`Server is running on localhost:${port}`)
)

const launcher = new ApolloEngineLauncher({
  apiKey: engineKey,
  origins: [
    {
      http: {
        url: `http://localhost:${port}${endpoint}`
      }
    }
  ],
  frontends: [
    {
      port: frontendPort,
      endpoints: [endpoint]
    }
  ]
})

// Start the Proxy; crash on errors.
launcher.start().catch(err => {
  throw err
})
