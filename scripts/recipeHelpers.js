let recipes = {};
recipes.desserts = require('../recipes/desserts');
recipes.fish = require('../recipes/fish');
recipes.bakery = require('../recipes/bakery');
recipes.meat = require('../recipes/meat');

const smallTalk = require('./smallTalk');

exports.getIngredients = (params) => {
  let category = params.category,
    id = params.id;
  let recipe = recipes[category][id];

  return recipe['ingredients'][0];
};

exports.getSummary = (params) => {
  let category = params.category,
    id = params.id;
  let recipe = recipes[category][id];

  return recipe.summary;
}

exports.getFullRecipe = (params) => {
  let category = params.category,
    id = params.id;
  let fullRecipe = recipes[category][id]['steps'].join(' ');
  return fullRecipe;
}

exports.readSteps = (params) => {
  let category = params.category,
    id = params.id,
    count = params.step;
  let steps = recipes[category][id]['steps'];
  let currentStep, resultStep;
  let preTalk = smallTalk.composeStart(params.intent);
  let postTalk = smallTalk.composeEnd(params.intent);

  currentStep = steps[count];
  let nextCount = count + 1;
  if (count == 0) {
    resultStep = `${preTalk} ${currentStep}, ${postTalk}`;
  } else {
    if (nextCount >= steps.length) {
      resultStep = `${currentStep} That's all, it was final step. I hope you'll like the result!`;
    } else {
      resultStep = `${preTalk} ${currentStep}, ${postTalk}`;
    }
  }
  return resultStep;
};
