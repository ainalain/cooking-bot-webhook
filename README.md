This is a Node.js service which is used as a webhook for Google API.AI bot.
It's a part of my Cooking Assistant project. You'll find client repo [here.](https://github.com/ainalain/react-cooking-assistant)

In order to modify assistant's behavior you should register your own agent on [Google API.AI website](https://api.ai/) and get the key for your [Google Cloud API](https://cloud.google.com/functions/docs/quickstart) project.
Store the *key.json* file in the config folder, edit webhook's code and upload your function to Google Cloud.

## Technologies used

**Javascript**: ES2015, Node JS

**Google API:** Google Cloud Functions
