import "dotenv/config";
import { OBSService } from "./services/OBSService";

const obs = new OBSService();

(async () => {
  await obs.connect();

  const name = await obs.getCurrentScene();

  const sources = await obs.getSceneSourcesList(name);

  const { sceneItemId } = await obs.getSceneItemId(name, "GroupSecondaryCam");

  await obs.setSceneItemEnabled(name, sceneItemId, true);
  console.log(name, sceneItemId, false);
})();
