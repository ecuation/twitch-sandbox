import OBSWebSocket, { EventSubscription } from "obs-websocket-js";

export class OBSService {
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
    const sources = this.obs.call("GetSceneItemList", {
      sceneName: name,
    });

    return sources;
  }

  public async getSceneItemId(sceneName: string, sourceName: string) {
    const itemId = this.obs.call("GetSceneItemId", {
      sceneName: sceneName,
      sourceName: sourceName,
    });

    return itemId;
  }

  public async setSceneItemEnabled(
    sceneName: string,
    sceneItemId: number,
    enabled: boolean
  ) {
    const state = this.obs.call("SetSceneItemEnabled", {
      sceneName: sceneName,
      sceneItemId: sceneItemId,
      sceneItemEnabled: enabled,
    });

    return state;
  }
}
