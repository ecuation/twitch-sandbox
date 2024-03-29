import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { ApiClient } from "@twurple/api";
import * as fs from "fs";
import path from "path";

export class TwitchChatService {
  public apiClient;
  public chatClient;

  private broadcasterName;
  private lastRaiderFile;

  constructor() {
    const clientId = process.env.CLIENTID || "";
    const accessToken = process.env.ACCESSTOKEN || "";
    const authProvider = new StaticAuthProvider(clientId, accessToken);
    this.broadcasterName = process.env.BROADCASTER || "";

    this.apiClient = new ApiClient({ authProvider });

    this.chatClient = new ChatClient({
      authProvider,
      channels: [this.broadcasterName],
      requestMembershipEvents: true,
    });

    this.lastRaiderFile = this.getLastRaiderFileName();

    this.chatClient.connect();
  }

  async getUserByName(name: string) {
    return await this.apiClient.users.getUserByName(name);
  }

  async banUser(userName: string) {
    const broadcaster = await this.getUserByName(this.broadcasterName);
    const user = await this.getUserByName(userName);

    if (broadcaster && user) {
      await this.apiClient.moderation.banUser(broadcaster.id, broadcaster.id, {
        reason: "Eres un bot suSio",
        user: user.id,
      });
    }
  }

  async unbanUser(userName: string) {
    const broadcaster = await this.getUserByName(this.broadcasterName);
    const user = await this.getUserByName(userName);

    await this.apiClient.moderation.unbanUser(
      broadcaster!.id,
      broadcaster!.id,
      user!.id
    );
  }

  updateLastRaiderFile(username: string) {
    fs.writeFile(this.lastRaiderFile, username, (err: any) => {
      if (err) {
        console.error(err);
      }
    });
  }

  lastRaiderPromo(broadcasterName: string) {
    return fs.readFile(
      this.lastRaiderFile,
      "utf8",
      (err: any, lastRaider: any) => {
        if (err) {
          throw err;
        }

        this.chatClient.say(
          broadcasterName,
          `Besito en el siempre sucio para https://twitch.com/${lastRaider} no te ahueves y dale un follow!`
        );
      }
    );
  }

  getLastRaiderFileName() {
    const appDir = path.resolve(__dirname, "../../");
    const fileName = "last_raider.txt";

    return `${appDir}/${fileName}`;
  }
}
