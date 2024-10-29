const { WebClient } = require('@slack/web-api');
require('dotenv').config();
const slackToken = process.env.SLACK_TOKEN;
const web = new WebClient(slackToken);

const notifySlack = async (message) => {
    try {
        await web.chat.postMessage({
            channel: '#webadmin',
            text: message
        });
    } catch (err) {
        console.error('Error sending message to Slack:', err);
    }
};

module.exports = { notifySlack };