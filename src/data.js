const getMeals = async connection => {
  const meals = connection.collection('meals')

  return meals.find({}).toArray()
}

module.exports = { getMeals }
