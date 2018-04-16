module.exports = `
  type Query {
    meals: [Meal]
  }

  type Meal @cacheControl(maxAge: 60) {
    id: ID
    name: String
    products: [Product]
  }

  type Product @cacheControl(maxAge: 60) {
    id: ID
    name: String
    articles: [Article]
  }

  type Article @cacheControl(maxAge: 60) {
    id: ID
    tpnb: Int
    name: String
    image: String
    description: String!
    portion: String
  }
`
