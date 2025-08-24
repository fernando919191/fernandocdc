import fetch from "node-fetch";
import { PREFIX } from "../funcionamiento/config.js";

export default {
  name: "bin",
  description: "Revisa información de un BIN usando HandyAPI",
  prefix: PREFIX,
  async execute(bot, msg) {
    const parts = msg.text.split(" ");
    const bin_input = parts[1];

    if (!bin_input || !/^\d{6,}$/.test(bin_input)) {
      return bot.sendMessage(msg.chat.id, `❌ Usa: ${PREFIX}bin <BIN de al menos 6 dígitos>`);
    }

    const HANDYAPI_KEY = "HAS-0YK50VkxMB643qWR4mPrgdpT";

    try {
      const res = await fetch(`https://data.handyapi.com/bin/${bin_input}`, {
        headers: { "x-api-key": HANDYAPI_KEY }
      });

      const api = await res.json();

      // 👀 Debug: ver qué devuelve la API
      console.log(api);

      if (api.Status === "SUCCESS") {
        const paisNombre = api.Country?.Name || "Desconocido";
        const marca = api.Scheme || "Desconocido";
        const tipo = api.Type || "Desconocido";
        const nivel = api.CardTier || "Desconocido";
        const banco = api.Issuer || "Desconocido";

        bot.sendMessage(msg.chat.id, `
🔹 Información solicitada:
Bin: ${bin_input}
Nivel: ${nivel}
Tipo: ${tipo}
Marca: ${marca}
País: ${paisNombre}
Banco: ${banco}
        `);
      } else {
        bot.sendMessage(msg.chat.id, `❌ API respondió: ${api.Message || "BIN inválido o sin datos."}`);
      }
    } catch (e) {
      bot.sendMessage(msg.chat.id, `❌ Error al conectar con la API: ${e.message}`);
    }
  }
};
