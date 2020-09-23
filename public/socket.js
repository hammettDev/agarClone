let socket = io.connect("http://localhost:8080");
// this function is called when the user clicks on the start button
const init = () => {
  draw();
  // console.log(orbs);
  socket.emit("init", {
    playerName: player.name,
  });
};

socket.on("initReturn", (data) => {
  orbs = data.orbs;
  setInterval(() => {
    socket.emit("tick", {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
});

socket.on("tock", (data) => {
  // console.log("this is the tock", data.players)
  (players = data.players),
    (player.locX = data.playerX),
    (player.locY = data.playerY);
});
