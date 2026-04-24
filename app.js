import * as THREE from "three";

const lerp = (a, b, t) => a + (b - a) * t;

/* Cursor glow */
(() => {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let x = tx;
  let y = ty;

  window.addEventListener("mousemove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
  });

  function tick() {
    x = lerp(x, tx, 0.08);
    y = lerp(y, ty, 0.08);
    glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }

  tick();
})();

/* Scroll reveal */
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
})();

/* Project filters */
(() => {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      cards.forEach((card) => {
        const categories = card.dataset.category || "";
        const visible = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !visible);
      });
    });
  });
})();

/* Interactive RAG pipeline */
(() => {
  const steps = [
    {
      label: "Step 01",
      title: "Ingest the messy internal knowledge base.",
      copy: "Confluence content is scraped, normalized, deduplicated, and prepared for retrieval. The goal is not to \"chat with docs\"; it is to preserve source structure so answers can be traced.",
      code: "source -> parser -> cleaner -> chunk queue",
    },
    {
      label: "Step 02",
      title: "Index for both meaning and exact language.",
      copy: "Dense vectors handle semantic similarity, while BM25 protects exact acronyms, team names, IDs, and procedural phrases. Hybrid retrieval is practical, not fashionable.",
      code: "chunks -> embeddings + BM25 -> FAISS + lexical index",
    },
    {
      label: "Step 03",
      title: "Retrieve a small, inspectable world.",
      copy: "The assistant should not reason over everything. It should retrieve the most relevant evidence, keep citations, and make it obvious why each source entered the context window.",
      code: "query -> HyDE -> hybrid search -> rerank -> top_k evidence",
    },
    {
      label: "Step 04",
      title: "Generate with constraints, not vibes.",
      copy: "The model answers from retrieved context, cites sources, admits uncertainty, and avoids pretending to know. UX matters here: confidence and provenance are product features.",
      code: "prompt(evidence, policy) -> answer + citations + uncertainty",
    },
    {
      label: "Step 05",
      title: "Evaluate like a production system.",
      copy: "Latency, retrieval hit rate, citation quality, hallucination checks, and user feedback loops turn a demo into something teams can trust.",
      code: "logs -> eval set -> retrieval metrics -> prompt / index iteration",
    },
  ];

  const nodes = document.querySelectorAll(".pipe-node");
  const stepEl = document.getElementById("lab-step");
  const titleEl = document.getElementById("lab-title");
  const copyEl = document.getElementById("lab-copy");
  const codeEl = document.getElementById("lab-code");
  if (!nodes.length || !stepEl || !titleEl || !copyEl || !codeEl) return;

  function render(index) {
    const step = steps[index];
    nodes.forEach((node, nodeIndex) => node.classList.toggle("active", nodeIndex === index));
    stepEl.textContent = step.label;
    titleEl.textContent = step.title;
    copyEl.textContent = step.copy;
    codeEl.textContent = step.code;
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => render(Number(node.dataset.step)));
  });
})();

/* Card tilt */
(() => {
  const card = document.querySelector(".hero-card");
  if (!card) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateZ(0)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
})();

/* 3D avatar: systems engineer bust */
(() => {
  const canvas = document.getElementById("avatar-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.9, 7.2);

  scene.add(new THREE.AmbientLight(0x8de9ff, 0.55));

  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(3.2, 4.5, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0x38d7ff, 4.2, 18);
  rim.position.set(-3, 1.8, 2);
  scene.add(rim);

  const violet = new THREE.PointLight(0xa855f7, 2.2, 18);
  violet.position.set(3, -1, 3);
  scene.add(violet);

  const root = new THREE.Group();
  scene.add(root);

  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xc8895b,
    roughness: 0.62,
    metalness: 0,
    clearcoat: 0.12,
  });
  const hair = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.75 });
  const hoodie = new THREE.MeshPhysicalMaterial({
    color: 0x12324d,
    roughness: 0.48,
    metalness: 0.08,
    clearcoat: 0.25,
  });
  const cyanMat = new THREE.MeshBasicMaterial({
    color: 0x38d7ff,
    transparent: true,
    opacity: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b1729,
    roughness: 0.1,
    metalness: 0.75,
    clearcoat: 1,
  });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.25, 1.5, 8, 24), hoodie);
  body.position.y = -1.55;
  body.scale.set(1.15, 0.95, 0.62);
  root.add(body);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.48, 24), skin);
  neck.position.y = -0.58;
  root.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.88, 36, 28), skin);
  head.position.y = 0.18;
  head.scale.set(0.92, 1.08, 0.86);
  root.add(head);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.9, 36, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  hairCap.position.set(0, 0.58, -0.03);
  hairCap.scale.set(0.96, 0.68, 0.92);
  root.add(hairCap);

  const fringe = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 5), hair);
  fringe.position.set(-0.32, 0.74, 0.58);
  fringe.rotation.set(0.65, -0.15, 0.42);
  root.add(fringe);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x06111f });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), eyeMat);
  eyeL.position.set(-0.28, 0.28, 0.73);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.28;
  root.add(eyeL, eyeR);

  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 24, Math.PI), eyeMat);
  smile.position.set(0, -0.08, 0.77);
  smile.rotation.set(0, 0, Math.PI);
  root.add(smile);

  const lensGeom = new THREE.TorusGeometry(0.18, 0.018, 8, 28);
  const lensL = new THREE.Mesh(lensGeom, glassMat);
  lensL.position.set(-0.28, 0.3, 0.78);
  const lensR = lensL.clone();
  lensR.position.x = 0.28;
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.025), glassMat);
  bridge.position.set(0, 0.3, 0.78);
  root.add(lensL, lensR, bridge);

  const laptop = new THREE.Group();
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 0.06), new THREE.MeshPhysicalMaterial({
    color: 0x08111f,
    emissive: 0x06344d,
    emissiveIntensity: 0.7,
    roughness: 0.24,
    metalness: 0.25,
  }));
  screen.position.set(0, -1.32, 1.05);
  screen.rotation.x = -0.18;
  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.58), cyanMat);
  screenGlow.position.set(0, -1.31, 1.088);
  screenGlow.rotation.x = -0.18;
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.08, 0.85), glassMat);
  base.position.set(0, -1.83, 1.35);
  base.rotation.x = 0.36;
  laptop.add(screen, screenGlow, base);
  root.add(laptop);

  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.035), cyanMat);
  badge.position.set(0.44, -1.15, 0.68);
  badge.rotation.z = -0.08;
  root.add(badge);

  const orbit = new THREE.Group();
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x38d7ff, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 3; i += 1) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.04), orbitMat);
    chip.userData.angle = (Math.PI * 2 * i) / 3;
    orbit.add(chip);
  }
  root.add(orbit);

  root.position.y = 0.08;
  root.rotation.y = -0.18;

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    root.position.y = 0.08 + Math.sin(t * 1.3) * 0.035;
    head.rotation.y = Math.sin(t * 0.75) * 0.08;
    hairCap.rotation.y = head.rotation.y;
    screenGlow.material.opacity = 0.52 + Math.sin(t * 2.4) * 0.16;

    orbit.children.forEach((chip, index) => {
      const angle = chip.userData.angle + t * 0.75;
      chip.position.set(Math.cos(angle) * 1.65, 0.15 + Math.sin(angle * 1.3) * 0.45, Math.sin(angle) * 0.5);
      chip.rotation.set(t * 0.7 + index, t * 0.9, 0);
    });

    camera.lookAt(0, -0.35, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();

/* Hero 3D: cloud architecture scene */
(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  camera.position.set(0, 3.2, 15);

  scene.add(new THREE.AmbientLight(0x9bdfff, 0.5));

  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(4, 8, 6);
  scene.add(key);

  const cyan = new THREE.PointLight(0x38d7ff, 4, 35);
  cyan.position.set(-5, 3, 4);
  scene.add(cyan);

  const violet = new THREE.PointLight(0xa855f7, 3.2, 35);
  violet.position.set(5, -1, -3);
  scene.add(violet);

  const root = new THREE.Group();
  scene.add(root);

  const nodeMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f2440,
    emissive: 0x06182c,
    metalness: 0.55,
    roughness: 0.22,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x38d7ff,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x38d7ff,
    transparent: true,
    opacity: 0.55,
  });

  const nodePositions = [
    [-3.7, 1.4, 0],
    [-1.5, 2.5, -0.9],
    [1.2, 2.0, 0.4],
    [3.7, 0.8, -0.5],
    [2.4, -1.5, 0.6],
    [-0.2, -2.1, -0.4],
    [-2.9, -0.9, 0.8],
  ];

  const nodes = nodePositions.map((position, index) => {
    const group = new THREE.Group();
    group.position.set(position[0], position[1], position[2]);

    const geometry = index % 2 === 0
      ? new THREE.BoxGeometry(0.76, 0.76, 0.76, 2, 2, 2)
      : new THREE.IcosahedronGeometry(0.5, 2);
    const mesh = new THREE.Mesh(geometry, nodeMat);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(mesh);

    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.82, 24, 24), glowMat);
    group.add(glow);

    root.add(group);
    return group;
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linePoints = [];
  for (let index = 0; index < nodePositions.length; index += 1) {
    const current = nodePositions[index];
    const next = nodePositions[(index + 1) % nodePositions.length];
    linePoints.push(...current, ...next);
  }
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
  const lines = new THREE.LineSegments(lineGeometry, edgeMat);
  root.add(lines);

  const core = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.22, 140, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x38d7ff,
      emissive: 0x0c3d5f,
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.8,
    })
  );
  root.add(core);

  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      color: 0x9bdfff,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(particles);

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

  window.addEventListener("mousemove", (event) => {
    tx = event.clientX / window.innerWidth - 0.5;
    ty = event.clientY / window.innerHeight - 0.5;
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    const time = clock.getElapsedTime();

    mx = lerp(mx, tx, 0.04);
    my = lerp(my, ty, 0.04);

    root.rotation.y = time * 0.08 + mx * 0.45;
    root.rotation.x = Math.sin(time * 0.3) * 0.12 + my * -0.3;
    root.position.x = 2.8;
    root.position.y = -0.1;

    core.rotation.x += 0.01;
    core.rotation.y += 0.014;

    nodes.forEach((node, index) => {
      node.rotation.x += 0.004 + index * 0.0004;
      node.rotation.y -= 0.005;
      node.position.y = nodePositions[index][1] + Math.sin(time * 1.2 + index) * 0.12;
    });

    particles.rotation.y = time * 0.015;
    particles.rotation.x = Math.sin(time * 0.12) * 0.08;

    camera.position.x = mx * 1.1;
    camera.position.y = 3.2 + my * -0.8;
    camera.lookAt(1.6, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();

/* Skills orbit */
(() => {
  const canvas = document.getElementById("skills-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  scene.add(new THREE.AmbientLight(0x8de9ff, 0.7));
  const light = new THREE.DirectionalLight(0xffffff, 2.2);
  light.position.set(4, 6, 6);
  scene.add(light);

  const group = new THREE.Group();
  scene.add(group);

  const central = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.12, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0x101d31,
      emissive: 0x082139,
      metalness: 0.72,
      roughness: 0.18,
      clearcoat: 0.9,
      wireframe: false,
    })
  );
  group.add(central);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.012, 12, 150),
    new THREE.MeshBasicMaterial({ color: 0x38d7ff, transparent: true, opacity: 0.58 })
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const labels = ["AWS", "React", "Node", "Java", "RAG", "Terraform", "Okta", "K8s"];
  const colors = [0x38d7ff, 0x6a7cff, 0x42f59b, 0xffd166, 0xa855f7, 0x38d7ff, 0xff5470, 0x42f59b];

  const satellites = labels.map((label, index) => {
    const sat = new THREE.Group();
    const angle = (Math.PI * 2 * index) / labels.length;
    sat.userData = { angle, radius: 2.6 + (index % 2) * 0.38, speed: 0.25 + index * 0.014 };

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshPhysicalMaterial({
        color: colors[index],
        emissive: colors[index],
        emissiveIntensity: 0.2,
        metalness: 0.55,
        roughness: 0.2,
      })
    );
    sat.add(mesh);

    const sprite = makeTextSprite(label);
    sprite.position.y = 0.42;
    sat.add(sprite);

    group.add(sat);
    return sat;
  });

  function makeTextSprite(text) {
    const canvas2d = document.createElement("canvas");
    canvas2d.width = 256;
    canvas2d.height = 96;
    const ctx = canvas2d.getContext("2d");
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    ctx.fillStyle = "rgba(7, 17, 31, 0.72)";
    roundRect(ctx, 24, 18, 208, 52, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 215, 255, 0.45)";
    ctx.stroke();
    ctx.font = "700 28px JetBrains Mono, monospace";
    ctx.fillStyle = "#eef6ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 44);

    const texture = new THREE.CanvasTexture(canvas2d);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.35, 0.5, 1);
    return sprite;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    const time = clock.getElapsedTime();
    group.rotation.y = time * 0.22;
    group.rotation.x = Math.sin(time * 0.4) * 0.18;
    central.rotation.x = time * 0.28;
    central.rotation.y = time * 0.36;

    satellites.forEach((sat) => {
      const angle = sat.userData.angle + time * sat.userData.speed;
      sat.position.set(
        Math.cos(angle) * sat.userData.radius,
        Math.sin(angle * 1.3) * 0.55,
        Math.sin(angle) * sat.userData.radius
      );
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();
