import * as fs from "fs";
import path from "path";
import { TwitchChatService } from "./TwitchChatService";

export class BotBouncer {
  private file;

  constructor() {
    this.file = this.getFileName();
  }

  getFileName() {
    const appDir = path.resolve(__dirname, "../../");
    const fileName = "bots";

    return `${appDir}/${fileName}`;
  }

  async getBotsFromInsights() {
    const response = await fetch("https://api.twitchinsights.net/v1/bots/all");
    const body = await response.text();

    return body;
  }

  writeBotsFile(data: string) {
    fs.writeFile(this.file, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }

  async updateBots() {
    const botsRaw = await this.getBotsFromInsights();
    const data = JSON.parse(botsRaw);
    const bots = this.formatBotsData(data.bots);

    this.writeBotsFile(JSON.stringify(bots));
  }

  readBotsFile(): [string] {  
    const data = fs.readFileSync(this.file, "utf8");
    const botsData = data ? JSON.parse(data) : [];

    return botsData;
  }

  formatBotsData(botsRaw: [string]) {
    return botsRaw.map((val: any) => {
      return val[0];
    });
  }

  checkUserIsBot(userName: string) {
    const bots = this.readBotsFile();
    return bots.includes(userName);
  }

  watch(userData: {
    twitchService: TwitchChatService;
    user: string;
    broadcasterName: string;
  }) {
    const { twitchService, user, broadcasterName } = userData;

    if (
      this.checkUserIsBot(user) &&
      user != "nightbot" &&
      user != "streamelements"
    ) {
      const message = `${user} baneado, es un bot suSio`;
      twitchService.banUser(user);
      twitchService.chatClient.say(broadcasterName, message);
      console.log(message);
    } else {
      console.log(`User ${user} joined at ${this.getCurrentDateTime()}`);
    }
  }

  getCurrentDateTime(): string {
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

    return dateTime;
  }
}
