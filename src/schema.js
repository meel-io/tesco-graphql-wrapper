const { makeExecutableSchema } = require("graphql-tools");
const fetch = require("node-fetch");
const dailyMeals = require('../data/meals');
const gql = String.raw;

const { TESCO_API_URL } = process.env;
const offset = 0;
const limit = 10;

const typeDefs = gql`
  type Query {
    meals: [Meal]
  }
  type Meal @cacheControl(maxAge: 60) {
    id: ID
    name: String
    products: [Product]
  }
  type Product @cacheControl(maxAge: 60) {
    id: ID,
    name: String,
    articles: [Article]
  }
  type Article @cacheControl(maxAge: 60) {
    id: ID,
    tpnb: Int,
    name: String,
    image: String,
    description: String!
    portion: String,
  }
`;

const resolvers = {
  Query: {
    meals: (root, args, context) => {
      return Promise.all(
        dailyMeals.map(({ products, name, id }) => {
          products.map(async ({ name, id }) => {
            const data = await fetch(
              `${TESCO_API_URL}?query=${name}&offset=${offset}&limit=${limit}`,
               { headers: { "Ocp-Apim-Subscription-Key": TESCO_API_KEY } }
            )
            const response = data.json();
            if (response.statusCode) {
              throw response.message;
            }

            const results = response.uk.ghs.products.results;
            const articles = results.map(article => {
              return { id, tpnb, name, image, description }
            })

            return { name, id, articles }
          })
        })
      );
    }
  }
};

// Required: Export the GraphQL.js schema object as "schema"
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = { schema };