# Tesco GraphQL API wrapper

Wrapping Tesco Groceries REST API in GraphQL

Using:

1.  GraphQL Yoga
2.  Apollo Engine & Apollo Server
3.  Docker

### Schema

```
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
```

### Usage

You'll need to get two API Keys

1.  [Tesco General API Key](https://devportal.tescolabs.com/products/56c73300d73fa303ed060001)
2.  [Apollo Engine API Key](https://engine.apollographql.com/)

Then

```docker-compose up```

And out to the playground...

(By default)

```http://localhost:4000```
