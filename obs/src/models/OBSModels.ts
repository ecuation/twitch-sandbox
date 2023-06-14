import type { JsonObject } from "type-fest";

export interface SceneItems {
  sceneItems: JsonObject[];
}

export interface sceneItem {
  sceneName: string;
  sceneItemId: number;
  sceneItemEnabled: boolean;
}

export interface filterItem {
  sourceName: string;
  filterName: string;
  filterEnabled: boolean;
}

export interface OBSRepositoryInterface {
  getCurrentScene(): Promise<string>;
  getSceneSourcesList(sceneName: string): Promise<SceneItems | undefined>;
  getSceneItem(
    sceneName: string,
    sourceName: string
  ): Promise<{ sceneItemId: number } | undefined>;
  setSceneItemEnabled(sceneItem: sceneItem): Promise<void>;
  setSourceFilterEnabled(filterItem: filterItem): Promise<void>;
}

export interface OBSInterface {
  connect(
    websocket: string | undefined,
    password: string | undefined,
    version: { rpcVersion: number }
  ): Promise<any>;
  call(eventName: string, data?: JsonObject): Promise<any>;
}
