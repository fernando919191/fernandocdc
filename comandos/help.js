import { PREFIX } from "../funcionamiento/config.js";

export default {
  name: "help",
  description: "Lista todos los comandos disponibles",
  prefix: PREFIX,
  execute(bot, msg, comandos) {
    const lista = comandos.map(c => `${c.prefix}${c.name} - ${c.description}`).join("\n");
    bot.sendMessage(msg.chat.id, `📌 Comandos disponibles:\n\n${lista}`);
  }
};
