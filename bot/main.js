const http = require("http");
const { Wechaty, ScanStatus, log } = require("wechaty");

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

  if (msg.text() === "ding") {
    await msg.say("dong");
  }
}

function onSimpleScan(qrcode, status) {
  console.log('onSimpleScan', status)
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

export default async function start() {
  await Wechaty.instance({ name: "wechat2roam-bot" }) // Singleton
    .on("scan", onSimpleScan)
    .on("login", (user) => console.log(`User ${user} logined`))
    .on("message", onMessage)
    .start();
}
