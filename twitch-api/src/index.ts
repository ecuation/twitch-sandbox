import "dotenv/config";
import { BotBouncer } from "./services/BotBouncer";
import { TwitchChatService } from "./services/TwitchChatService";

(async () => {
  const twitchService = new TwitchChatService();
  const broadcasterName = process.env.BROADCASTER || "";
  const bouncer = new BotBouncer();

  twitchService.chatClient.onRaid((channel, user, raidInfo) => {
    const { displayName: raider, viewerCount } = raidInfo;
    if (viewerCount > 2) {
      twitchService.updateLastRaiderFile(raider);
    }
  });

  twitchService.chatClient.onJoin((channel, user) => {
    const today = new Date();
    const date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;

    if (
      bouncer.checkUserIsBot(user) &&
      user != "nightbot" &&
      user != "streamelements"
    ) {
      const message = `${user} baneado, es un bot suSio`;
      twitchService.banUser(user);
      twitchService.chatClient.say(broadcasterName, message);
      console.log(message);
    } else {
      console.log(`User ${user} joined at ${dateTime}`);
    }
  });

  twitchService.chatClient.onMessage(async (channel, user, text, msg) => {
    const broadcasterId = msg.channelId;
  });

  // const scenes = await obs.call("GetSceneList");
  // console.log(scenes);
})();
