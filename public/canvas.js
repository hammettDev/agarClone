const fColor1 = Math.floor(255 * Math.random());
const fColor2 = Math.floor(255 * Math.random());
const fColor3 = Math.floor(255 * Math.random());
const sColor1 = Math.floor(255 * Math.random());
const sColor2 = Math.floor(255 * Math.random());
const sColor3 = Math.floor(255 * Math.random());
player.locX = Math.floor(500 * Math.random() + 10);
player.locY = Math.floor(500 * Math.random() + 10);

const init = () => {
  draw();
  console.log(orbs);
};

const draw = () => {
  //clear the screen from last fram
  // reset the translation back to default
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  context.translate(camX, camY);
  context.beginPath();
  context.fillStyle = `rgb(${fColor1},${fColor2},${fColor3})`;
  // arg1,2 = x,y of the center of the arc
  // arg 3 is radius of the circle            |
  // arg 4 is the radian, where to start      |
  // arg 5 is where to stop in radians        V
  context.arc(player.locX, player.locY, 10, 0, Math.PI * 2);
  context.arc(200, 200, 10, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = `rgb(${sColor1},${sColor2},${sColor3})`;
  context.stroke();

  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(draw);
};

canvas.addEventListener("mousemove", (e) => {
  console.log(e);
  const mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    //mouse is in the lower right quad
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    //mouse is in the lower left quad
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    //mouse is in the upper left quad
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    //mouse is in the upper right quad
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  speed = 10;
  xV = xVector;
  yV = yVector;

  if (
    (player.locX < 5 && player.xVector < 0) ||
    (player.locX > 500 && xV > 0)
  ) {
    player.locY -= speed * yV;
  } else if ((player.locY < 5 && yV > 0) || (player.locY > 500 && yV < 0)) {
    player.locX += speed * xV;
  } else {
    player.locX += speed * xV;
    player.locY -= speed * yV;
  }
});
