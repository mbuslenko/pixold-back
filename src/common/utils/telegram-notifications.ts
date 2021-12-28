import axios from 'axios';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_NOTIFICATIONS_CHAT } from '../../config';

export const sendNotification = async (message: string) => {
  return axios.get(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_NOTIFICATIONS_CHAT}&text=${message}`,
  );
};
