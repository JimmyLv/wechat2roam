const http = require("http");
const { Wechaty, log } = require("wechaty");

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
  console.log("Server started at: http://localhost");
  started = true;
};

async function onMessage(msg) {
  log.info("StarterBot", msg.toString());

  if (msg.text() === "ding") {
    await msg.say("dong");
  }
}

export default function start() {
  Wechaty.instance({ name: "wechat2roam-bot" }) // Singleton
    .on("scan", (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`Scan QR Code to login: ${status}\n${url}`);

      printURLOnPage(url);
    })
    .on("login", (user) => console.log(`User ${user} logined`))
    .on("message", onMessage)
    .start();
}
