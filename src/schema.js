const fetch = require('node-fetch')
const { getMeals } = require('./data')
const typeDefs = require('./typeDefs')

const { TESCO_API_URL, TESCO_API_KEY } = process.env
const offset = 0
const limit = 10

const resolvers = {
  Query: {
    meals: async (root, args, { db }) => {
      const dailyMeals = await getMeals(db)
      return Promise.all(
        dailyMeals.map(({ products, name, id }) => {
          const formattedProducts = products.map(async ({ name, id }) => {
            const data = await fetch(
              `${TESCO_API_URL}?query=${name}&offset=${offset}&limit=${limit}`,
              { headers: { 'Ocp-Apim-Subscription-Key': TESCO_API_KEY } }
            )
            const response = await data.json()
            if (response.statusCode) {
              throw response.message
            }

            const results = response.uk.ghs.products.results
            const articles = results.map(result => {
              return {
                id: result.id,
                tpnb: result.tpnb,
                name: result.name,
                image: result.image,
                description: result.description
              }
            })

            return { name, id, articles }
          })

          return { id, name, products: formattedProducts }
        })
      )
    }
  }
}

module.exports = { typeDefs, resolvers }
