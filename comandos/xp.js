import { PREFIX } from "../funcionamiento/config.js";

export default {
  name: "xp",
  prefix: PREFIX,
  description: "Transforma dos números de 16 dígitos según el procedimiento y oculta parte del resultado",

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

    function transformarOculto(n1, n2) {
      const g1n1 = n1.slice(0, 8);
      const g2n1 = n1.slice(8, 16);
      const g1n2 = n2.slice(0, 8);
      const g2n2 = n2.slice(8, 16);

      // Multiplicación dígito a dígito
      let resultado = "";
      for (let i = 0; i < 8; i++) {
        const mult = parseInt(g1n2[i]) * parseInt(g2n2[i]);
        resultado += mult.toString();
      }

      // Recortar a 8 dígitos
      resultado = resultado.slice(0, 8);

      // Ahora generamos el resultado final con "x" en los dígitos que queremos ocultar
      // Aquí mantenemos el primer grupo visible y mostramos solo los primeros 2 dígitos del segundo grupo
      let final = g1n1 + "x" + g2n1[2] + g2n1[3] + "xxxxx"; 
      return final;
    }

    const final = transformarOculto(n1, n2);
    bot.sendMessage(msg.chat.id, `✅ Resultado: ${final}`);
  }
};
