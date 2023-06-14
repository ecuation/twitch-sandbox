import type { JsonObject } from "type-fest";

export interface SceneItems {
  sceneItems: JsonObject[];
}

export interface sceneItem {
  sceneName: string;
  sceneItemId: number;
  enabled: boolean;
}

export interface OBSCallable {
  connect(
    wb: string | undefined,
    pass: string | undefined,
    version: { rpcVersion: number }
  ): Promise<any>;
  getCurrentScene(): Promise<string>;
  getSceneSourcesList(name: string): Promise<SceneItems>;
  getSceneItemId(sceneName: string, sourceName: string): Promise<number>;
  setSceneItemEnabled(sceneItem: sceneItem): Promise<void>;
  call(eventName: string, data?: any): Promise<any>;
}
