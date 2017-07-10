/*
 HTTP Cloud Function.

 @param {Object} req Cloud Function request context.
 @param {Object} res Cloud Function response context.
*/
'use strict';

const logger = require('./scripts/logger').logger;
const { log, entry } = logger();

const { produceResponse } = require('./scripts/response');

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

   let result = produceResponse(params);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": result, "displayText": result}));
};
