const http = require("http");
const { Wechaty, ScanStatus, log } = require("wechaty");
const sendToRoam = require('./services/roam')

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

async function onMessage(message) {
  // 自己发给自己，直接保存
  const talker = message.talker();
  if (message.self() || talker.name().includes("吕立青@JimmyLv")) {
    log.info("RoamBot", message.toString());

    await sendToRoam(message);
  }
  if (message.text() === "ding") {
    await message.say("dong");
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
