import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import tmi from "tmi.js";
import { z } from "zod";

// Process Config
dotenv.config();

const configSchema = z.object({
  DISCORD_CHANNEL_ID: z.string(),
  DISCORD_TOKEN: z.string(),
});

const config = configSchema.parse(process.env);

// Main Application
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordClient.on("ready", async (client) => {
  console.info("Discord Bot Connected...");

  const twitchClient = new tmi.Client({
    channels: ["homelessdev"],
  });

  await twitchClient.connect().catch(console.error);
  console.info("Twitch Bot Connected...");

  twitchClient.on("message", async (_channel, tags, message, _self) => {
    const newChat = `[${tags.username}] : ${message.toString()}`;
    console.log(newChat);

    (client.channels.cache.get(config.DISCORD_CHANNEL_ID) as TextChannel).send(
      newChat
    );
  });
});

discordClient.login(config.DISCORD_TOKEN);
