/*
 HTTP Cloud Function.

 @param {Object} req Cloud Function request context.
 @param {Object} res Cloud Function response context.
*/
'use strict';

let recipes = {};
recipes.desserts = require('./recipes/desserts');
recipes.fish = require('./recipes/fish');
recipes.bakery = require('./recipes/bakery');
recipes.meat = require('./recipes/meat');


exports.recipeWebhook = (req, res) => {
  let params = req.body.result.contexts[0]['parameters'],
  context = req.body.result.contexts[0]['name'];
  let result;
  if (context == 'ingredients') {
    result = getIngredients(params.category, params.id);
  } else if (context == 'whole_recipe') {
    result = getFullRecipe(params.category, params.id);
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": result, "displayText": result}));
};

const getIngredients = (category, id) => {
  let recipe = recipes[category][id];

  return recipe['ingredients'][0];
};

const getFullRecipe = (category, id) => {
  let fullRecipe = recipes[category][id]['steps'].join(' ');
  return fullRecipe;
}
