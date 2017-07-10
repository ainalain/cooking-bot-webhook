const { getIngredients, getFullRecipe, getSummary, readSteps } = require('./recipeHelpers');

exports.produceResponse = (params) => {
  let result, data;
  switch (params.intent) {
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
  return result;
};
