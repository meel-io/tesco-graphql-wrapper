const fetch = require('node-fetch')
const { getMeals } = require('./data')

const { TESCO_API_URL, TESCO_API_KEY } = process.env
const offset = 0
const limit = 10

module.exports = {
  Query: {
    meals: async (root, args, { db }) => {
      const dailyMeals = await getMeals(db)
      return Promise.all(
        dailyMeals.map(({ products, name, id }) => {
          const formattedProducts = getFormattedProducts(products)

          return { id, name, products: formattedProducts }
        })
      )
    }
  }
}

const getFormattedProducts = (products) => {
  return products.map(async ({ name, id }) => {
    const data = await fetch(
      `${TESCO_API_URL}?query=${name}&offset=${offset}&limit=${limit}`,
      { headers: { 'Ocp-Apim-Subscription-Key': TESCO_API_KEY } }
    )
    const response = await data.json()
    if (response.statusCode) {
      throw response.message
    }

    const articles = getFormattedArticles(response.uk.ghs.products.results)

    return { name, id, articles }
  })
}

const getFormattedArticles = articles => {
  articles.map(article => {
    return {
      id: article.id,
      tpnb: article.tpnb,
      name: article.name,
      image: article.image,
      description: article.description
    }
  })
}
