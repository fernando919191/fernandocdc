import { PREFIX } from "../funcionamiento/config.js";

export default {
  name: "ping",
  description: "Responde con Pong!",
  prefix: PREFIX,
  execute(bot, msg) {
    bot.sendMessage(msg.chat.id, "🏓 Pong!");
  }
};
