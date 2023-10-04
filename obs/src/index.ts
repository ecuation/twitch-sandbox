import "dotenv/config";
import { OBSService } from "./services/OBSService";

const obs = new OBSService();

(async () => {

  obs.connect();
  
  const currentSceneName = await obs.getCurrentScene();

  console.log(currentSceneName);

  const sources = await obs.getSceneSourcesList(currentSceneName);

  const sceneItem = await obs.getSceneItem(
    currentSceneName,
    "GroupSecondaryCam"
  );

  if (sceneItem) {
    const { sceneItemId } = sceneItem;

    await obs.setSceneItemEnabled({
      sceneItemId,
      sceneName: currentSceneName,
      sceneItemEnabled: false,
    });

    console.log(currentSceneName, sceneItemId, false);
  }

  await obs.setSourceFilterEnabled({
    sourceName: "4K Video Capture",
    filterName: "Colour Correction",
    filterEnabled: true,
  });
})();
