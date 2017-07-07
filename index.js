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
  step = +recipeContext.parameters.step,
  intent = req.body.result.metadata.intentName,
  params = { category, id, step, intent };
  //write a custom log for debugging
  log.debug(entry, function(err, apiResponse) {
    console.log('this is a custom log');
    console.log('request intent: ', intent);
    console.log('request count: ', step);
  });

  let result, data;
  switch (intent) {
    case 'read_ingredients':
      data = getIngredients(params);
      result = `You need ${data}. That's all. Do you want to hear the whole recipe?`;
      break;
    case 'read_summary':
      data = getSummary(params);
      result = `${data} I will guide you through all steps with more details. Are you ready to start?`;
      break;
    case 'start_reading_steps':
      result = readSteps(params);
      break;
    case 'steps_one_by_one':
      result = readSteps(params);
      break;
    case 'start_reading_steps - repeat':
    case 'steps_one_by_one - repeat':
      let newStep = params.step - 1;
      params.step = newStep;
      result = readSteps(params);
      break;
    case 'steps_one_by_one - previous':
      let prevStep = params.step - 2;
      params.step = prevStep;
      result = readSteps(params);
      break;
    default:
      result = 'Sorry, I didn\'t understand your intent. Could you repeat please?';
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

const getSummary = (params) => {
  let category = params.category,
    id = params.id;
  let recipe = recipes[category][id];

  return recipe.summary;
}

const getFullRecipe = (params) => {
  let category = params.category,
    id = params.id;
  let fullRecipe = recipes[category][id]['steps'].join(' ');
  return fullRecipe;
}

const readSteps = (params) => {
  let category = params.category,
    id = params.id,
    count = params.step;
  let steps = recipes[category][id]['steps'];
  let currentStep, resultStep;
  let preTalk = composeStart(params.intent);

  currentStep = steps[count];
  let nextCount = count + 1;
  if (count == 0) {
    resultStep = `${preTalk} ${currentStep} When done, call to me!`;
  } else {
    if (nextCount >= steps.length) {
      resultStep = `${currentStep} That's all, it was final step. I hope you'll like the result!`;
    } else {
      resultStep = `${preTalk} ${currentStep} When done, call to me!`;
    }
  }
  return resultStep;
};

const composeStart = (intent) => {
  const repeatSmallTalk = [
    'Of course!', 'Sure!', 'No problem!'
  ];
  let preTalk = '';
  switch(intent) {
    case 'start_reading_steps':
      preTalk = 'Let\'s start then!';
      break;
    case 'start_reading_steps - repeat':
    case 'steps_one_by_one - repeat':
    case 'steps_one_by_one - previous':
      preTalk = repeatSmallTalk[Math.floor(Math.random() * repeatSmallTalk.length)];
      break;
    default:
    preTalk = '';
  }
  return preTalk;
}
