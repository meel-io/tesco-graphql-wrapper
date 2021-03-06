require('dotenv').config()
const { GraphQLServer } = require('graphql-yoga')
const { ApolloEngineLauncher } = require('apollo-engine')
const { typeDefs, resolvers } = require('./schema')
const mongoClient = require('mongodb').MongoClient

const engineKey = process.env.APOLLO_ENGINE_KEY
const port = process.env.PORT || 4000
const frontendPort = process.env.APOLLO_PORT || 3000
const endpoint = process.env.ENDPOINT || '/'
const connectionString = process.env.MONGO_URL || 'mongodb://mongo:27017'

const start = async () => {
  const connection = await mongoClient.connect(connectionString)
  const db = await connection.db('groceries')
  const context = { db }
  const server = new GraphQLServer({ typeDefs, resolvers, context })

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
}

start()
