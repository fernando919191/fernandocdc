import TelegramBot from "node-telegram-bot-api";
import { TOKEN } from "./token.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new TelegramBot(TOKEN, { polling: true });

// Cargar automáticamente todos los comandos
const comandosPath = path.join(__dirname, "../comandos");
const archivosComandos = fs.readdirSync(comandosPath).filter(f => f.endsWith(".js"));

const comandos = [];
for (const archivo of archivosComandos) {
  const { default: comando } = await import(path.join(comandosPath, archivo));
  comandos.push(comando);

  // Registrar el comando con su prefijo
  bot.onText(new RegExp(`^${comando.prefix}${comando.name}$`), (msg) => {
    comando.execute(bot, msg, comandos);
  });
}

console.log("🤖 Bot de Telegram en línea con comandos automáticos y prefijo...");
