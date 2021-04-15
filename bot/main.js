const http = require("http");
const { Wechaty, ScanStatus, log } = require("wechaty");
const RoamPrivateApi = require("roam-research-private-api");

const roam = new RoamPrivateApi(
  process.env.ROAM_API_GRAPH,
  process.env.ROAM_API_EMAIL,
  process.env.ROAM_API_PASSWORD,
  {
    headless: true,
  }
);

let qrcodeURL = "";
let started = false;
const printURLOnPage = (url) => {
  qrcodeURL = url;
  if (started) return;
  const requestListener = (req, res) => {
    res.writeHead(200);
    res.end(`<script>location.href='${qrcodeURL}'</script>`);
  };

  const server = http.createServer(requestListener);
  server.listen(80);
  console.log(`Server started at: ${process.env.VERCEL_URL}`);
  started = true;
};

async function onMessage(msg) {
  log.info("StarterBot", msg.toString());

  const contact = msg.talker();
  if (contact.name().includes("吕立青@JimmyLv.info")) {
    log.info("sending to RoamResearch...", msg.text());
    const dailyNoteUid = roam.dailyNoteUid();
    const input = `${msg.text()} #WeChat`;
    await roam.logIn();
    await roam.createBlock(input, dailyNoteUid);
    // await roam.close();
    // await roam.quickCapture('测试一下');

    log.info("sent to RoamResearch...", input);
    await msg.say("保存成功！");
  }
  if (msg.text() === "ding") {
    await msg.say("dong");
  }
}

function onEasyScan(qrcode, status) {
  console.log(
    `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
      qrcode
    )}`
  );
}
function onSimpleScan(qrcode, status) {
  console.log("onSimpleScan", status);
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    require("qrcode-terminal").generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");

    log.info(
      "StarterBot",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info("StarterBot", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onScan(qrcode, status) {
  const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
  console.log(`Scan QR Code to login: ${status}\n${url}`);

  printURLOnPage(url);
}

module.exports = async function start() {
  await Wechaty.instance({ name: "wechat2roam-bot" }) // Singleton
    .on("scan", onEasyScan)
    .on("login", (user) => console.log(`User ${user} logined`))
    .on("message", onMessage)
    .start();
};
