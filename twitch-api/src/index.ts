import "dotenv/config";
import { BotBouncer } from "./services/BotBouncer";
import { TwitchChatService } from "./services/TwitchChatService";

(async () => {
  const twitchService = new TwitchChatService();
  const broadcasterName = process.env.BROADCASTER || "";
  const bouncer = new BotBouncer();

  const today = new Date();
  const date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;

  twitchService.chatClient.onJoin((channel, user) => {
    if (bouncer.checkUserIsBot(user)) {
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

    console.log(`user ${user} ${broadcasterId}`);
  });

  // const scenes = await obs.call("GetSceneList");
  // console.log(scenes);
})();
