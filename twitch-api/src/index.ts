import "dotenv/config";
import { BotBouncer } from "./services/BotBouncer";
import { TwitchChatService } from "./services/TwitchChatService";

(async () => {
  const twitchService = new TwitchChatService();
  const broadcasterName = process.env.BROADCASTER || "";
  const bouncer = new BotBouncer();
  
  twitchService.chatClient.onRaid((channel: string, user, raidInfo) => {
    const { displayName: raider, viewerCount } = raidInfo;
    if (viewerCount > 2) {
      twitchService.updateLastRaiderFile(raider);
    }
  });

  twitchService.chatClient.onJoin((channel: string, user) => {
    bouncer.watch({ twitchService, user, broadcasterName });
  });

  twitchService.chatClient.onMessage(async (channel, user, text, msg) => {
    if (text === "!autopromo") twitchService.lastRaiderPromo(broadcasterName);
  });

  console.log('update...');
  
  // const scenes = await obs.call("GetSceneList");
  // console.log(scenes);
})();
