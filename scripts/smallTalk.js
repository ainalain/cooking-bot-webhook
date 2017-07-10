const repeatSmallTalk = [
  'Of course!', 'Sure!', 'No problem!'
];

const variousEnd = ['When done, call to me!', 'Then call to me!', 'Say when you\'re ready', 'Call me  after that', 'I wait you do it, call my name!'];

const logger = require('./logger').logger;
const { log, entry } = logger();

exports.composeStart = (intent) => {
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
};

exports.composeEnd = (intent) => {
  let talk = '';
  switch (intent) {
    case 'steps_one_by_one':
    case 'steps_one_by_one - repeat':
    case 'steps_one_by_one - previous':
      talk = variousEnd[Math.floor(Math.random() * variousEnd.length)];
      break;
    default:
      talk = '';
  }
  return talk;
};
