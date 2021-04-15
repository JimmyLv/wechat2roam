const RoamPrivateApi = require("roam-research-private-api");
const { log } = require("wechaty");

const roamApi = new RoamPrivateApi(
  process.env.ROAM_API_GRAPH,
  process.env.ROAM_API_EMAIL,
  process.env.ROAM_API_PASSWORD,
  {
    headless: true,
    args: ["--no-sandbox"],
  }
);

async function sendToRoam(message) {
  const memo = message.text();
  if (memo.startsWith(`保存成功！可继续编辑：`)) {
    console.log("message", message.text());
    return;
  }

  log.info("sending to RoamResearch...", memo);
  const dailyNoteUid = roamApi.dailyNoteUid();
  const input = `${memo} #WeChat`;
  // await roamApi.logIn();
  // const blockUid = await roamApi.createBlock(input, dailyNoteUid);
  // await roamApi.close();
  await roamApi.quickCapture(input);

  log.info("sent to RoamResearch...", input);
  await message.say(
    `保存成功！可继续编辑：https://roamresearch.com/#/app/${process.env.ROAM_API_GRAPH}/page/${dailyNoteUid}`
  );
}

module.exports = sendToRoam;
