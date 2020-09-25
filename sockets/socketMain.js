const io = require("../servers").io;
const checkForOrbCollisions = require("./checkCollisions")
  .checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollisions")
  .checkForPlayerCollisions;
const { connected } = require("process");
// =======Classes======
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");
const Orb = require("./classes/Orbs");

let orbs = [];
let players = [];

let settings = {
  defaultOrbs: 100,
  defaultSpeed: 6,
  defaultSize: 6,
  // as player gets bigger, the zoom needs to decrease
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};
initGame();

setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players,
    });
  }
}, 33); // there are 30 33s in 1000 ms. so 1 frame

// issue a message to this connected socket 30 fps

io.sockets.on("connect", (socket) => {
  let player = {};
  // a player has connected
  socket.on("init", (data) => {
    // add player to the game namespace
    socket.join("game");
    // make a playerConfig Object
    let playerConfig = new PlayerConfig(settings);
    // make a playerData Object

    let playerData = new PlayerData(data.playerName, settings);
    // make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);
    setInterval(() => {
      io.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33); // there are 30 33s in 1000 ms. so 1 frame

    socket.emit("initReturn", {
      orbs,
    });
    players.push(playerData);
  });
  // the client sent over a tick. That means we know what direction to move the socket
  socket.on("tick", (data) => {
    speed = player.playerConfig.speed;
    // update the playerConfig object with the new direction in data
    // and at the same time create a local variable for this callback for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
    // ORB COLLISION
    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );
    capturedOrb
      .then((data) => {
        // then runs if resolves runs! a collision happened!
        // emit to all sockets the orb to replace
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };
        // every socket needs to know the leaderboard has changed
        io.sockets.emit("updateLeaderBoard", getLeaderboard());
        io.sockets.emit("orbSwitch", orbData);
      })
      .catch(() => {
        // catch happens if reject runs! No collision
      });
    // Player COLLISION
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );
    playerDeath
      .then((data) => {
        // every socket needs to know the leaderboard has changed
        io.sockets.emit("updateLeaderBoard", getLeaderboard());
        // player was absorbed, let everyone know
        io.sockets.emit("playerDeath", data);
      })
      .catch(() => {
        // catch happens if reject runs! No collision
      });
  });
  socket.on("disconnect", (data) => {
    if (player.playerData) {
      players.forEach((currPlayer, i) => {
        if (currPlayer.uid == player.playerData.uid) {
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        }
      });
    }

    // some point update stats
  });
});
function getLeaderboard() {
  // sort players in decending order
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let LeaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
    };
  });
  return LeaderBoard;
}
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}
module.exports = io;
