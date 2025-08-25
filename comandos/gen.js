import fetch from "node-fetch";
import { PREFIX } from "../funcionamiento/config.js";

const HANDYAPI_KEY = "HAS-0YK50VkxMB643qWR4mPrgdpT"; // pon tu key de HandyAPI

// Algoritmo de Luhn para el dígito final
function generarLuhn(base) {
  let sum = 0;
  let shouldDouble = true;

  for (let i = base.length - 1; i >= 0; i--) {
    let digit = parseInt(base[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (10 - (sum % 10)) % 10;
}

// Genera una tarjeta completa
function generarTarjeta(bin, mes, anio) {
  // Completar hasta 15 dígitos
  let base = bin;
  while (base.length < 15) {
    base += Math.floor(Math.random() * 10);
  }

  const checkDigit = generarLuhn(base);
  const tarjeta = base + checkDigit;

  const mesFinal = mes || String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const anioFinal = anio || (2025 + Math.floor(Math.random() * 10));
  const cvv = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  return `${tarjeta}|${mesFinal}|${anioFinal}|${cvv}`;
}

// Genera un bloque con 10 tarjetas
async function generarBloque(bin, mes, anio, user) {
  let tarjetas = [];
  for (let i = 0; i < 10; i++) {
    tarjetas.push(generarTarjeta(bin, mes, anio));
  }

  // Info del BIN desde HandyAPI
  let info = "No disponible";
  let banco = "Desconocido";
  let pais = "Desconocido";

  try {
    const res = await fetch(`https://data.handyapi.com/bin/${bin}`, {
      headers: { "x-api-key": HANDYAPI_KEY }
    });
    const api = await res.json();

    if (api.Status === "SUCCESS") {
      info = `${api.Scheme || "?"} - ${api.Type || "?"} - ${api.CardTier || "?"}`;
      banco = api.Issuer || "Desconocido";
      pais = api.Country?.Name || "Desconocido";
    }
  } catch {
    info = "Error consultando API";
  }

  return `
Generator Card  
Bin: ${bin}|rnd|rnd|rnd
--------------------
${tarjetas.join("\n")}
--------------------
Info: ${info}
Bank: ${banco}
Country: ${pais}
--------------------
Gen by ${user}
  `;
}

export default {
  name: "gen",
  description: "Genera 10 tarjetas dummy a partir de un BIN",
  prefix: PREFIX,
  async execute(bot, msg) {
    const input = msg.text.split(" ")[1];
    if (!input) {
      return bot.sendMessage(msg.chat.id, `❌ Usa: ${PREFIX}gen <BIN>|<MM>|<YY>`);
    }

    const parts = input.split("|");
    const bin = parts[0];
    const mes = parts[1] || null;
    let anio = parts[2] || null;
    if (anio && anio.length === 2) anio = "20" + anio;

    const user = msg.from.first_name || "User";

    const texto = await generarBloque(bin, mes, anio, user);

    bot.sendMessage(msg.chat.id, texto, {
      reply_markup: {
        inline_keyboard: [[
          { text: "Re-Gen 🔄", callback_data: `regen_${bin}_${mes || "rnd"}_${anio || "rnd"}` }
        ]]
      }
    });
  }
};

// Manejar el callback para regenerar
export async function handleCallback(bot, query) {
  if (!query.data.startsWith("regen_")) return;

  const [ , bin, mes, anio ] = query.data.split("_");
  const user = query.from.first_name || "User";

  const texto = await generarBloque(bin, mes === "rnd" ? null : mes, anio === "rnd" ? null : anio, user);

  bot.editMessageText(texto, {
    chat_id: query.message.chat.id,
    message_id: query.message.message_id,
    reply_markup: {
      inline_keyboard: [[
        { text: "Re-Gen 🔄", callback_data: `regen_${bin}_${mes}_${anio}` }
      ]]
    }
  });

  bot.answerCallbackQuery(query.id);
                       }
