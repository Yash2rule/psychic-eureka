import { WebClient } from '@slack/web-api';

const SLACK_API_KEY = 'YOUR_SLACK_API_KEY'; // Replace with your actual Slack API Key

const web = new WebClient(SLACK_API_KEY);

export const sendMessageToSlack = async (text: string, channel: string) => {
  try {
    const response = await web.chat.postMessage({
      channel,
      text,
    });
    return response;
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    throw error;
  }
};
