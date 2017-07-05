/*
 HTTP Cloud Function.

 @param {Object} req Cloud Function request context.
 @param {Object} res Cloud Function response context.
*/
'use strict';

const gcloud = require('gcloud')({
  keyFilename: './config/key.json',
  projectId: 'leo-tnoqwg'
});
const logging = gcloud.logging();
const log = logging.log('my-custom-log');
const entry = log.entry('compute.googleapis.com', {
  user: 'my_username'
});

let recipes = {};
recipes.desserts = require('./recipes/desserts');
recipes.fish = require('./recipes/fish');
recipes.bakery = require('./recipes/bakery');
recipes.meat = require('./recipes/meat');


exports.recipeWebhook = (req, res) => {
  let recipeContext = req.body.result.contexts.find(context => {
    return context.name == 'recipecontext';
  });
  let category = recipeContext.parameters.category,
  id = recipeContext.parameters.id,
  intent = req.body.result.metadata.intentName,
  params = { category, id };
  //write a custom log for debugging
  log.debug(entry, function(err, apiResponse) {
    console.log('this is a custom log');
    console.log('request intent: ', intent);
  });

  let result;
  switch (intent) {
    case 'read_ingredients':
      result = getIngredients(params);
      break;
    case 'read_all_steps':
      result = getFullRecipe(params);
      break;
    default:
      result = 'Sorry, I didn\'t find the intent name.';
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": result, "displayText": result}));
};

const getIngredients = (params) => {
  let category = params.category,
    id = params.id;
  let recipe = recipes[category][id];

  return recipe['ingredients'][0];
};

const getFullRecipe = (params) => {
  let category = params.category,
    id = params.id;
  let fullRecipe = recipes[category][id]['steps'].join(' ');
  return fullRecipe;
}
