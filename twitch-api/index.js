import "dotenv/config";
import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

const obs = new OBSWebSocket();
const clientId = process.env.CLIENTID;
const accessToken = process.env.ACCESSTOKEN;
const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });

const chatClient = new ChatClient({ authProvider, channels: ["ecuationable"] });
chatClient.connect();

const broadcaster = await apiClient.users.getUserByName("ecuationable");
const user = await apiClient.users.getUserByName("retroidmaniac");

// await apiClient.moderation.banUser(broadcaster.id, broadcaster.id, {
//   reason: "testing twitch api",
//   user: user.id,
// });

// await apiClient.moderation.unbanUser(broadcaster.id, broadcaster.id, user.id);

chatClient.onMessage(async (channel, user, text, msg) => {
  const broadcasterId = msg.channelId;

  console.log(`user ${user} ${broadcasterId}`);
});

// const scenes = await obs.call("GetSceneList");
// console.log(scenes);
