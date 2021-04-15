const http = require("http");
const { Wechaty } = require("wechaty");
const ScheduleHandler = require("./handler/scheduleHandler");
const OpsHandler = require("./handler/opsHandler");
const RoomNameMatcher = require("./roomNameMatcher");

const roomNameMatcher = new RoomNameMatcher([
  new ScheduleHandler(),
  new OpsHandler(),
]);

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

export default function start() {
  Wechaty.instance() // Singleton
    .on("scan", (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`Scan QR Code to login: ${status}\n${url}`);

      printURLOnPage(url);
    })
    .on("login", (user) => console.log(`User ${user} logined`))
    .on("message", async (message) => {
      const handlers = await roomNameMatcher.match(message);
      handlers.forEach((h) => h.handle(message));
    })
    .start();
}
