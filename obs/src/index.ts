import "dotenv/config";
import { OBSRepository } from "./services/OBSRepository";
import { OBSCallable } from "./models/OBSModels";
import OBSWebSocket from "obs-websocket-js";

const obs = new OBSRepository();

(async () => {
  await obs.connect();

  const name = await obs.getCurrentScene();
  console.log(name, "test");

  const sources = await obs.getSceneSourcesList(name);

  const sceneItemId = await obs.getSceneItemId(name, "GroupSecondaryCam");

  await obs.setSceneItemEnabled({
    sceneItemId,
    sceneName: name,
    enabled: true,
  });

  console.log(name, sceneItemId, false);
})();
