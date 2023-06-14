import OBSWebSocket from "obs-websocket-js";
import { OBSCallable, sceneItem } from "../models/OBSModels";

export class OBSRepository {
  private obs: OBSWebSocket;

  constructor() {
    this.obs = new OBSWebSocket();
  }

  public async connect(): Promise<void> {
    const { obsWebSocketVersion, negotiatedRpcVersion } =
      await this.obs.connect(process.env.OBSWS, process.env.OBSPASSWORD, {
        rpcVersion: 1,
      });
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
  }

  public async getCurrentScene(): Promise<string> {
    const { currentProgramSceneName } = await this.obs.call(
      "GetCurrentProgramScene"
    );

    return currentProgramSceneName;
  }

  public async getSceneSourcesList(name: string) {
    const sources = await this.obs.call("GetSceneItemList", {
      sceneName: name,
    });

    return sources;
  }

  public async getSceneItemId(sceneName: string, sourceName: string) {
    const { sceneItemId } = await this.obs.call("GetSceneItemId", {
      sceneName: sceneName,
      sourceName: sourceName,
    });

    return sceneItemId;
  }

  public async setSceneItemEnabled(sceneItem: sceneItem) {
    const { sceneItemId, sceneName, enabled } = sceneItem;

    const state = await this.obs.call("SetSceneItemEnabled", {
      sceneName: sceneName,
      sceneItemId: sceneItemId,
      sceneItemEnabled: enabled,
    });

    return state;
  }
}
