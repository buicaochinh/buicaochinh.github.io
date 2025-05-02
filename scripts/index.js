// Thiết lập scene, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Tạo lá
function createLeaf() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.5, 0.5, 1, 0);
  shape.quadraticCurveTo(1.5, -0.5, 1, -1);
  shape.quadraticCurveTo(0.5, -1.5, 0, -1);
  shape.quadraticCurveTo(-0.5, -1.5, -1, -1);
  shape.quadraticCurveTo(-1.5, -0.5, -1, 0);
  shape.quadraticCurveTo(-0.5, 0.5, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2ecc71,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x2ecc71,
    emissiveIntensity: 0.2,
  });

  const leaf = new THREE.Mesh(geometry, material);
  return leaf;
}

// Tạo nhiều lá
const leaves = [];
const numLeaves = 50;

for (let i = 0; i < numLeaves; i++) {
  const leaf = createLeaf();

  // Phân bố lá ngẫu nhiên ở phía trên
  leaf.position.set(
    Math.random() * 100 - 50,
    Math.random() * 50 + 30,
    Math.random() * 20 - 10
  );

  // Kích thước ngẫu nhiên
  const scale = Math.random() * 0.5 + 0.5;
  leaf.scale.set(scale, scale, scale);

  leaf.userData = {
    speed: Math.random() * 0.1 + 0.05,
    rotationSpeed: Math.random() * 0.02 + 0.01,
    swingSpeed: Math.random() * 0.02 + 0.01,
    swingAmount: Math.random() * 0.1 + 0.05,
    phase: Math.random() * Math.PI * 2,
    fallSpeed: Math.random() * 0.1 + 0.05,
  };

  scene.add(leaf);
  leaves.push(leaf);
}

// Thêm ánh sáng
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 0, 10);

const pointLight2 = new THREE.PointLight(0xffffff, 1.0);
pointLight2.position.set(-20, 20, 10);

const pointLight3 = new THREE.PointLight(0xffffff, 1.0);
pointLight3.position.set(20, -20, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(pointLight, pointLight2, pointLight3, ambientLight);

// Xử lý chuyển đổi theme
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

function updateLeafColors(isDark) {
  const color = isDark ? 0x27ae60 : 0x2ecc71;
  const emissiveColor = isDark ? 0x27ae60 : 0x2ecc71;
  leaves.forEach((leaf) => {
    leaf.material.color.setHex(color);
    leaf.material.emissive.setHex(emissiveColor);
    leaf.material.opacity = isDark ? 0.7 : 0.8;
    leaf.material.emissiveIntensity = isDark ? 0.3 : 0.2;
  });
}

function toggleTheme() {
  const isDark = body.classList.toggle("dark-theme");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  updateLeafColors(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-theme");
  icon.className = "fas fa-sun";
  updateLeafColors(true);
}

themeToggle.addEventListener("click", toggleTheme);

// Xử lý sự kiện scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// Xử lý resize window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Di chuyển ánh sáng
  pointLight2.position.x = Math.sin(time * 0.5) * 20;
  pointLight2.position.y = Math.cos(time * 0.5) * 20;
  leaves.forEach((leaf) => {
    // Rơi xuống
    leaf.position.y -= leaf.userData.fallSpeed;

    // Dao động qua lại
    leaf.position.x +=
      Math.sin(time * leaf.userData.swingSpeed + leaf.userData.phase) *
      leaf.userData.swingAmount;

    // Xoay lá
    leaf.rotation.z += leaf.userData.rotationSpeed;
    leaf.rotation.x = Math.sin(time * leaf.userData.swingSpeed) * 0.2;

    // Thay đổi độ trong suốt nhẹ nhàng
    leaf.material.opacity =
      0.7 + Math.sin(time * 0.5 + leaf.userData.phase) * 0.1;

    // Reset vị trí khi lá rơi quá thấp
    if (leaf.position.y < -30) {
      leaf.position.y = Math.random() * 50 + 30;
      leaf.position.x = Math.random() * 100 - 50;
      leaf.position.z = Math.random() * 20 - 10;
      leaf.rotation.z = Math.random() * Math.PI * 2;
      leaf.userData.phase = Math.random() * Math.PI * 2;
    }
  });

  renderer.render(scene, camera);
}

animate();
