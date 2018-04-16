const getMeals = async db => {
  const meals = db.collection('meals')

  return meals.find({}).toArray()
}

module.exports = { getMeals }
