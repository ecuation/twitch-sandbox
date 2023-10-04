import { error } from "console";
import {
  OBSInterface,
  OBSRepositoryInterface,
  filterItem,
  sceneItem,
} from "../models/OBSModels";
import OBSWebSocket from "obs-websocket-js";

export class OBSService implements OBSRepositoryInterface {
  constructor(private obs: OBSInterface = new OBSWebSocket()) {}

  public async connect() {    

    try {
      const { obsWebSocketVersion, negotiatedRpcVersion } =
      await this.obs.connect(process.env.OBSWS, process.env.OBSPASSWORD, {
        rpcVersion: 1,
      });
      console.log(
        `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
      );  
    } catch (error: any) {
        console.error('Failed to connect', error.code, error.message);
    }
  }

  public async getCurrentScene(): Promise<string> {
    const { currentProgramSceneName } = await this.obs.call(
      "GetCurrentProgramScene"
    );

    return currentProgramSceneName;
  }

  public async getSceneSourcesList(sceneName: string) {
    return await this.obs
      .call("GetSceneItemList", {
        sceneName: sceneName,
      })
      .then((sources) => sources)
      .catch((error) => console.log("error: ", error));
  }

  public async getSceneItem(
    sceneName: string,
    sourceName: string
  ): Promise<{ sceneItemId: number } | undefined> {
    return await this.obs
      .call("GetSceneItemId", {
        sceneName: sceneName,
        sourceName: sourceName,
      })
      .then((item) => item)
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  public async setSceneItemEnabled(sceneItem: sceneItem) {
    const { sceneItemId, sceneName, sceneItemEnabled } = sceneItem;

    await this.obs
      .call("SetSceneItemEnabled", {
        sceneName,
        sceneItemId,
        sceneItemEnabled,
      })
      .then((status) => status)
      .catch((error) => console.log(error));
  }

  public async setSourceFilterEnabled(sourceItem: filterItem) {
    const { sourceName, filterName, filterEnabled } = sourceItem;
    await this.obs
      .call("SetSourceFilterEnabled", {
        sourceName,
        filterName,
        filterEnabled,
      })
      .then((status) => status)
      .catch((error) => console.log(error));
  }
}
