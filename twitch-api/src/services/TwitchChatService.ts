import { StaticAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { ApiClient } from "@twurple/api";

export class TwitchChatService {
  public apiClient;
  public chatClient;

  private broadcasterName;

  constructor() {
    const clientId = process.env.CLIENTID || "";
    const accessToken = process.env.ACCESSTOKEN || "";
    const authProvider = new StaticAuthProvider(clientId, accessToken);
    this.broadcasterName = process.env.BROADCASTER || "";

    this.apiClient = new ApiClient({ authProvider });

    this.chatClient = new ChatClient({
      authProvider,
      channels: [this.broadcasterName],
    });

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
}
