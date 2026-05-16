const stick = document.getElementById("stick");
const container = document.getElementById("joystick-container");
const player = document.getElementById("player");

let active = false;
let moveX = 0;
let moveY = 0;

const center = {
  x: 60,
  y: 60
};

container.addEventListener("pointerdown", () => {
  active = true;
});

window.addEventListener("pointerup", () => {
  active = false;

  stick.style.left = "30px";
  stick.style.top = "30px";

  moveX = 0;
  moveY = 0;
});

window.addEventListener("pointermove", (e) => {

  if (!active) return;

  const rect = container.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let dx = x - center.x;
  let dy = y - center.y;

  const max = 40;

  const distance = Math.sqrt(dx*dx + dy*dy);

  if (distance > max) {
    dx = dx / distance * max;
    dy = dy / distance * max;
  }

  stick.style.left = `${dx + 30}px`;
  stick.style.top = `${dy + 30}px`;

  moveX = dx / max;
  moveY = dy / max;
});

const camera = document.querySelector("a-camera");

AFRAME.registerComponent("move-player", {

  tick: function () {

    if (moveX === 0 && moveY === 0) return;

    // Dirección hacia donde mira la cámara
    const direction = new THREE.Vector3();
    camera.object3D.getWorldDirection(direction);

    // Evitar movimiento vertical
    direction.y = 0;
    direction.normalize();

    // Vector lateral
    const right = new THREE.Vector3();
    right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

    // Velocidad
    const speed = 0.05;

    // Movimiento adelante/atrás
    player.object3D.position.add(
      direction.clone().multiplyScalar(moveY * speed)
    );

    // Movimiento lateral
    player.object3D.position.add(
      right.clone().multiplyScalar(-moveX * speed)
    );
  }
});

player.setAttribute("move-player", "");
