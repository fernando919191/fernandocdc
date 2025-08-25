import { PREFIX } from "../funcionamiento/config.js";

export default {
  name: "xp",
  prefix: PREFIX,
  description: "Transforma dos números de 16 dígitos según el procedimiento",

  execute(bot, msg, comandos) {
    const args = msg.args;
    if (!args[0] || !args[1]) {
      return bot.sendMessage(msg.chat.id, `❌ Usa: ${PREFIX}xp <numero1> <numero2>`);
    }

    const n1 = args[0].replace(/\D/g, "");
    const n2 = args[1].replace(/\D/g, "");

    if (n1.length !== 16 || n2.length !== 16) {
      return bot.sendMessage(msg.chat.id, "❌ Ambos números deben tener 16 dígitos.");
    }

    function transformar(n1, n2) {
      const g1n1 = n1.slice(0, 8);
      const g2n2 = n2.slice(8, 16);
      const g1n2 = n2.slice(0, 8);

      let resultado = "";
      for (let i = 0; i < 8; i++) {
        const mult = parseInt(g1n2[i]) * parseInt(g2n2[i]);
        resultado += mult.toString();
      }

      resultado = resultado.slice(0, 8);
      return g1n1 + resultado;
    }

    const final = transformar(n1, n2);
    bot.sendMessage(msg.chat.id, `✅ Resultado: ${final}`);
  }
};
