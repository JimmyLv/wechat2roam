const https = require("https");

const params = {
  ref: "master",
  envs: [
    {
      name: "REMOTE_HOST",
      value: "111.231.101.187",
      sensitive: 0,
    },
    {
      name: "REMOTE_CRED",
      value: "71780bfa-e16b-425c-97e7-36a0e39cacd2",
      sensitive: 0,
    },
    {
      name: "REMOTE_USER_NAME",
      value: "ansible",
      sensitive: 0,
    },
  ],
};

const data = JSON.stringify(params);

class OpsHandler {
  constructor() {
    this.roomName = "软件匠艺结对直播主播群";
    this.hostname = "codingstyle-cn.coding.net";
    this.path = "/api/cci/job/550964/trigger";
    this.username = process.env.CI_USER;
    this.password = process.env.CI_PASSWORD;
  }

  async handle(message) {
    const text = message.text();
    if (text === "机器人变身") {
      this.triggerDeploy();
      await message.say("巴啦啦能量—沙罗沙罗—小魔仙—全身变");
    }
  }

  triggerDeploy() {
    const options = {
      hostname: this.hostname,
      port: 443,
      path: this.path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        Authorization:
          "Basic " +
          new Buffer(this.userName + ":" + this.password).toString("base64"),
      },
    };

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(data);

    req.end();
  }
}

module.exports = OpsHandler;
