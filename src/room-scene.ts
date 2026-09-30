import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { studioLighting } from "./room-lighting";

// Procedural concept geometry shared by the preview and review projections.
export const roomTargets: Record<string, THREE.Vector3> = {
  blackrose: new THREE.Vector3(2.62, 2.25, -1.7),
  predikta: new THREE.Vector3(-0.62, 2.25, -1.55),
  portfolio: new THREE.Vector3(2.55, 1.65, 1.48),
  experience: new THREE.Vector3(-3.55, 2.3, 0.4),
};
const C = {
  floor: "#252d40",
  wall: "#303a4b",
  teal: "#678983",
  dark: "#181d31",
  beige: "#e6ddc4",
  pale: "#f0e9d2",
  wood: "#807663",
};

export function createRoom() {
  const root = new THREE.Group();
  const structure = new THREE.Group();
  structure.name = "lower-room";
  root.add(structure);
  const ceiling = new THREE.Group();
  ceiling.name = "reflected-ceiling";
  root.add(ceiling);
  const props: Record<string, THREE.Group> = {};
  const materials: THREE.Material[] = [];
  const pending: Promise<void>[] = [];
  function material(
    color: string,
    roughness = 0.65,
    metalness = 0,
    emissive = false,
  ) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      ...(emissive ? { emissive: color, emissiveIntensity: 1.25 } : {}),
    });
    materials.push(m);
    return m;
  }
  const mats = {
    floor: material(C.floor),
    wall: material(C.wall),
    teal: material(C.teal),
    dark: material(C.dark),
    beige: material(C.beige, 0.4, 0.3),
    pale: material(C.pale),
    wood: material(C.wood),
    glow: material("#81b8a7", 0.3, 0.1, true),
    black: material("#101421"),
    trim: material("#3e4d5d", 0.4, 0.5),
  };
  function mesh(
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    p: number[],
    name = "",
  ) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...(p as [number, number, number]));
    m.castShadow = true;
    m.receiveShadow = true;
    m.name = name;
    parent.add(m);
    return m;
  }
  function box(
    parent: THREE.Object3D,
    size: number[],
    position: number[],
    mat: THREE.Material,
    radius = 0.025,
    name = "",
  ) {
    return mesh(
      parent,
      new RoundedBoxGeometry(
        ...(size as [number, number, number]),
        2,
        Math.min(radius, ...size.map((n) => n / 3)),
      ),
      mat,
      position,
      name,
    );
  }
  function cylinder(
    parent: THREE.Object3D,
    rt: number,
    rb: number,
    h: number,
    p: number[],
    mat: THREE.Material,
    name = "",
  ) {
    return mesh(
      parent,
      new THREE.CylinderGeometry(rt, rb, h, 32),
      mat,
      p,
      name,
    );
  }
  function torus(
    parent: THREE.Object3D,
    r: number,
    tube: number,
    p: number[],
    mat: THREE.Material,
    arc = Math.PI * 2,
  ) {
    return mesh(parent, new THREE.TorusGeometry(r, tube, 8, 40, arc), mat, p);
  }
  function texture(
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D) => void,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d")!);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
    materials.push(m);
    return m;
  }
  function imageMaterial(path: string) {
    const m = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      side: THREE.DoubleSide,
      toneMapped: false,
      depthWrite: false,
    });
    materials.push(m);
    pending.push(
      new Promise<void>((resolve) => {
        const tex = new THREE.TextureLoader().load(
          path,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            m.needsUpdate = true;
            resolve();
          },
          undefined,
          () => resolve(),
        );
        m.map = tex;
      }),
    );
    return m;
  }
  function face(
    parent: THREE.Object3D,
    width: number,
    height: number,
    p: number[],
    mat: THREE.Material,
    rotation = 0,
  ) {
    const m = mesh(parent, new THREE.PlaneGeometry(width, height), mat, p);
    m.rotation.y = rotation;
    return m;
  }
  function label(
    text: string,
    background: string = C.dark,
    color: string = C.pale,
  ) {
    return texture(768, 192, (ctx) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 768, 192);
      ctx.fillStyle = color;
      ctx.font = "500 66px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 384, 98);
    });
  }
  function prop(id: string, position: number[]) {
    const group = new THREE.Group();
    group.name = id;
    group.userData.exhibit = id;
    group.position.set(...(position as [number, number, number]));
    root.add(group);
    props[id] = group;
    return group;
  }

  box(structure, [8, 0.3, 6.4], [0, -0.15, 0], mats.floor, 0.07, "floor");
  box(
    structure,
    [8.08, 0.15, 6.48],
    [0, -0.36, 0],
    mats.black,
    0.07,
    "foundation",
  );
  box(
    structure,
    [8, 3.4, 0.18],
    [0, 1.7, -3.12],
    mats.wall,
    0.015,
    "back-wall",
  );
  box(
    structure,
    [0.18, 3.4, 6.4],
    [-3.92, 1.7, 0],
    mats.wall,
    0.015,
    "left-wall",
  );
  const right = box(
    structure,
    [0.18, 3.4, 6.4],
    [3.92, 1.7, 0],
    mats.wall,
    0.01,
    "cutaway-right-wall",
  );
  right.visible = false;
  const front = box(
    structure,
    [8, 3.4, 0.18],
    [0, 1.7, 3.12],
    mats.wall,
    0.01,
    "cutaway-front-wall",
  );
  front.visible = false;
  const slab = box(
    ceiling,
    [8, 0.18, 6.4],
    [0, 3.49, 0],
    mats.wall,
    0.01,
    "cutaway-ceiling",
  );
  slab.visible = false;
  for (let x = -3.5; x < 4; x += 0.5)
    box(structure, [0.012, 0.004, 6.05], [x, 0.003, 0], mats.trim, 0.001);
  box(
    structure,
    [7.8, 0.045, 0.04],
    [0, 0.13, -2.99],
    mats.glow,
    0.005,
    "back-led-strip",
  );
  box(
    structure,
    [0.04, 0.045, 6.1],
    [-3.8, 0.13, 0],
    mats.glow,
    0.005,
    "left-led-strip",
  );
  box(
    structure,
    [4.9, 2.55, 0.07],
    [-0.55, 1.95, -3.005],
    mats.dark,
    0.015,
    "acoustic-backboard",
  );
  for (let x = -2.85; x < 1.9; x += 0.17)
    box(structure, [0.06, 2.45, 0.055], [x, 1.95, -2.94], mats.trim, 0.012);
  face(structure, 2.4, 0.6, [-0.6, 2.78, -2.9], label("build. play. repeat."));
  box(structure, [2.42, 0.014, 0.01], [-0.6, 2.42, -2.885], mats.glow, 0.002);

  const desk = prop("predikta", [-0.8, 0, -1.7]);
  box(desk, [4.3, 0.15, 1.55], [0, 1.14, 0], mats.black, 0.055, "desk-top");
  box(
    desk,
    [4.2, 0.025, 0.025],
    [0, 1.1, 0.76],
    mats.glow,
    0.005,
    "desk-edge-light",
  );
  for (const x of [-1.8, 1.8]) {
    box(desk, [0.13, 1.08, 1.2], [x, 0.54, 0], mats.trim, 0.02, "desk-leg");
    box(desk, [0.42, 0.055, 1.3], [x, 0.0275, 0], mats.black);
  }
  box(desk, [0.62, 0.05, 0.38], [0.15, 1.245, -0.43], mats.trim);
  box(desk, [0.09, 0.42, 0.09], [0.15, 1.47, -0.5], mats.trim);
  box(
    desk,
    [1.7, 1.02, 0.09],
    [0.15, 2.06, -0.5],
    mats.black,
    0.035,
    "external-monitor",
  );
  const marketingScreen = texture(1024, 600, (ctx) => {
    ctx.fillStyle = "#181d31";
    ctx.fillRect(0, 0, 1024, 600);
    ctx.fillStyle = "#242e40";
    ctx.fillRect(0, 0, 180, 600);
    ctx.fillStyle = "#e6ddc4";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("PREDIKTA", 214, 70);
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#9caeb0";
    ctx.fillText("Marketing intelligence", 216, 102);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i === 0 ? "#678983" : "#53616e";
      ctx.fillRect(26, 120 + i * 60, 123, 13);
    }
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = "#303e4d";
      ctx.fillRect(218 + i * 254, 140, 230, 100);
      ctx.fillStyle = "#e6ddc4";
      ctx.font = "28px sans-serif";
      ctx.fillText(
        ["Audience", "Campaigns", "Insights"][i],
        236 + i * 254,
        185,
      );
    }
    ctx.fillStyle = "#222b3c";
    ctx.fillRect(218, 275, 740, 260);
    ctx.strokeStyle = "#89b5a5";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(250, 477);
    [
      [350, 410],
      [450, 445],
      [550, 370],
      [660, 392],
      [790, 320],
      [920, 336],
    ].forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.stroke();
  });
  face(desk, 1.58, 0.9, [0.15, 2.06, -0.451], marketingScreen);
  face(
    desk,
    0.19,
    0.129,
    [-0.51, 2.42, -0.447],
    imageMaterial("/images/predikta-signup.png"),
  );
  const laptop = new THREE.Group();
  laptop.name = "laptop";
  laptop.position.set(-1.18, 1.237, -0.13);
  laptop.rotation.y = 0.14;
  desk.add(laptop);
  box(laptop, [1, 0.04, 0.68], [0, 0, 0], mats.trim, 0.025);
  const lid = new THREE.Group();
  lid.position.set(0, 0, -0.31);
  lid.rotation.x = -0.16;
  laptop.add(lid);
  box(lid, [1, 0.67, 0.035], [0, 0.335, 0], mats.black, 0.02);
  const codeScreen = texture(700, 470, (ctx) => {
    ctx.fillStyle = "#141a29";
    ctx.fillRect(0, 0, 700, 470);
    ctx.fillStyle = "#273345";
    ctx.fillRect(0, 0, 700, 40);
    ctx.fillStyle = "#d8d3bc";
    ctx.font = "17px monospace";
    ctx.fillText("portfolio.tsx", 35, 27);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = ["#83ac9e", "#d7c49a", "#8e9fbc"][i % 3];
      ctx.fillRect(45 + (i % 3) * 22, 70 + i * 25, 100 + ((i * 47) % 410), 7);
    }
  });
  face(lid, 0.92, 0.57, [0, 0.335, 0.02], codeScreen);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 12; col++)
      box(
        laptop,
        [0.055, 0.009, 0.047],
        [-0.41 + col * 0.073, 0.027, -0.19 + row * 0.067],
        mats.dark,
        0.004,
      );
  box(laptop, [0.31, 0.005, 0.15], [0, 0.024, 0.2], mats.dark, 0.006);
  box(
    desk,
    [1.94, 0.014, 0.65],
    [0.35, 1.222, 0.38],
    mats.teal,
    0.035,
    "mousepad",
  );
  box(
    desk,
    [1.12, 0.05, 0.39],
    [0.02, 1.254, 0.36],
    mats.black,
    0.03,
    "mechanical-keyboard",
  );
  box(desk, [1.09, 0.013, 0.37], [0.02, 1.245, 0.36], mats.glow, 0.025);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 14; col++)
      box(
        desk,
        [0.061, 0.025, 0.055],
        [-0.47 + col * 0.075, 1.292, 0.225 + row * 0.079],
        col === 0 || row === 0 ? mats.teal : mats.beige,
        0.007,
      );
  box(
    desk,
    [0.38, 0.023, 0.053],
    [0.005, 1.292, 0.542],
    mats.beige,
    0.007,
    "spacebar",
  );
  const mouse = mesh(
    desk,
    new THREE.SphereGeometry(0.135, 20, 12),
    mats.black,
    [1.05, 1.272, 0.36],
    "gaming-mouse",
  );
  mouse.scale.set(0.65, 0.4, 1.15);
  box(desk, [0.011, 0.008, 0.19], [1.05, 1.326, 0.35], mats.glow, 0.002);
  const phone = new THREE.Group();
  phone.position.set(1.59, 1.24, -0.36);
  phone.name = "phone-and-stand";
  desk.add(phone);
  box(phone, [0.32, 0.035, 0.32], [0, 0, 0], mats.trim);
  box(phone, [0.045, 0.25, 0.04], [0, 0.13, -0.08], mats.trim);
  const handset = new THREE.Group();
  handset.position.y = 0.25;
  handset.rotation.x = -0.13;
  phone.add(handset);
  box(handset, [0.26, 0.5, 0.026], [0, 0, 0], mats.black, 0.035);
  const phoneTexture = texture(260, 500, (ctx) => {
    ctx.fillStyle = "#678983";
    ctx.fillRect(0, 0, 260, 500);
    ctx.fillStyle = "#f0e9d2";
    ctx.font = "54px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("21:04", 130, 170);
    ctx.font = "18px sans-serif";
    ctx.fillText("One more commit.", 130, 220);
  });
  face(handset, 0.22, 0.44, [0, 0, 0.016], phoneTexture);
  cylinder(
    desk,
    0.17,
    0.17,
    0.018,
    [-1.73, 1.228, 0.37],
    mats.wood,
    "coffee-coaster",
  );
  cylinder(
    desk,
    0.105,
    0.095,
    0.2,
    [-1.73, 1.337, 0.37],
    mats.beige,
    "coffee-cup",
  );
  cylinder(desk, 0.088, 0.088, 0.004, [-1.73, 1.439, 0.37], mats.black);
  torus(desk, 0.071, 0.018, [-1.61, 1.342, 0.37], mats.beige);
  const headset = new THREE.Group();
  headset.position.set(1.6, 1.235, 0.33);
  headset.name = "headset";
  desk.add(headset);
  cylinder(headset, 0.16, 0.16, 0.025, [0, 0, 0], mats.black);
  cylinder(headset, 0.022, 0.022, 0.528, [0, 0.276, 0], mats.trim);
  torus(headset, 0.165, 0.025, [0, 0.4, 0], mats.black, Math.PI);
  for (const x of [-0.16, 0.16]) {
    box(headset, [0.085, 0.18, 0.105], [x, 0.36, 0], mats.black, 0.03);
    box(
      headset,
      [0.009, 0.12, 0.07],
      [x < 0 ? x - 0.045 : x + 0.045, 0.36, 0],
      mats.teal,
      0.003,
    );
  }

  box(
    structure,
    [3.1, 0.014, 2.05],
    [-0.65, 0.012, 0.05],
    mats.black,
    0.17,
    "chair-mat",
  );
  const chair = new THREE.Group();
  chair.position.set(-0.65, 0, 0.02);
  chair.name = "gaming-chair";
  structure.add(chair);
  box(chair, [0.78, 0.13, 0.68], [0, 0.68, 0], mats.black, 0.08);
  box(chair, [0.55, 0.04, 0.58], [0, 0.757, -0.03], mats.teal, 0.05);
  const back = box(chair, [0.8, 1.12, 0.18], [0, 1.3, 0.29], mats.black, 0.1);
  back.rotation.x = 0.12;
  box(chair, [0.5, 0.65, 0.035], [0, 1.18, 0.414], mats.teal, 0.06);
  box(chair, [0.46, 0.22, 0.2], [0, 1.83, 0.31], mats.black, 0.06);
  for (const x of [-0.25, 0.25])
    box(chair, [0.15, 0.12, 0.027], [x, 1.65, 0.392], mats.beige, 0.04);
  for (const x of [-0.5, 0.5]) {
    box(chair, [0.08, 0.3, 0.08], [x, 0.83, 0], mats.trim);
    box(chair, [0.16, 0.07, 0.49], [x, 1.005, 0], mats.black, 0.03);
  }
  cylinder(chair, 0.055, 0.055, 0.54, [0, 0.345, 0], mats.trim);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 0.4;
    const leg = box(
      chair,
      [0.46, 0.055, 0.07],
      [Math.cos(a) * 0.2, 0.09, Math.sin(a) * 0.2],
      mats.trim,
    );
    leg.rotation.y = -a;
    const wheel = cylinder(
      chair,
      0.05,
      0.05,
      0.055,
      [Math.cos(a) * 0.39, 0.05, Math.sin(a) * 0.39],
      mats.black,
    );
    wheel.rotation.z = Math.PI / 2;
  }

  const rose = prop("blackrose", [2.6, 0, -1.9]);
  box(
    rose,
    [1.18, 1.02, 0.88],
    [0, 0.51, 0],
    mats.black,
    0.04,
    "gaming-cabinet",
  );
  box(rose, [1.21, 0.055, 0.91], [0, 1.047, 0], mats.trim, 0.025);
  box(rose, [0.09, 0.48, 0.09], [0, 1.3, -0.05], mats.trim);
  box(
    rose,
    [1.1, 1.18, 0.07],
    [0, 1.99, -0.05],
    mats.black,
    0.04,
    "blackrose-screen",
  );
  face(
    rose,
    0.98,
    1.06,
    [0, 1.99, -0.011],
    new THREE.MeshBasicMaterial({ color: "#111520" }),
  );
  face(
    rose,
    0.52,
    0.57,
    [0, 2.13, -0.006],
    imageMaterial("/images/black-rose-emblem.png"),
  );
  face(
    rose,
    0.83,
    0.2,
    [0, 1.71, -0.002],
    label("BLACK ROSE", "#111520", C.beige),
  );
  box(rose, [1.1, 0.023, 0.025], [0, 1.06, 0.45], mats.glow, 0.003);
  const gamepad = new THREE.Group();
  gamepad.position.set(0, 1.125, 0.17);
  gamepad.name = "game-controller";
  rose.add(gamepad);
  box(gamepad, [0.52, 0.11, 0.27], [0, 0, 0], mats.beige, 0.055);
  for (const x of [-0.235, 0.235]) {
    const grip = box(
      gamepad,
      [0.16, 0.14, 0.36],
      [x, -0.015, 0.065],
      mats.beige,
      0.06,
    );
    grip.rotation.y = x < 0 ? -0.2 : 0.2;
  }
  for (const x of [-0.11, 0.11])
    cylinder(gamepad, 0.047, 0.047, 0.027, [x, 0.07, 0.07], mats.black);
  box(gamepad, [0.1, 0.02, 0.032], [-0.19, 0.072, -0.065], mats.black, 0.003);
  box(gamepad, [0.032, 0.02, 0.1], [-0.19, 0.072, -0.065], mats.black, 0.003);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    cylinder(
      gamepad,
      0.015,
      0.015,
      0.02,
      [0.19 + Math.cos(a) * 0.041, 0.072, -0.065 + Math.sin(a) * 0.041],
      mats.teal,
    );
  }

  const display = prop("portfolio", [2.52, 0, 1.47]);
  box(
    display,
    [1.2, 0.07, 0.91],
    [0, 0.84, 0],
    mats.wood,
    0.06,
    "portfolio-side-table",
  );
  for (const x of [-0.43, 0.43])
    for (const z of [-0.3, 0.3])
      box(display, [0.055, 0.805, 0.055], [x, 0.4025, z], mats.trim);
  box(display, [0.52, 0.035, 0.32], [0, 0.9, -0.09], mats.trim);
  box(display, [0.06, 0.21, 0.055], [0, 1.02, -0.16], mats.trim);
  box(display, [0.68, 0.92, 0.06], [0, 1.45, -0.14], mats.beige, 0.035);
  const portfolioScreen = texture(600, 850, (ctx) => {
    ctx.fillStyle = "#202638";
    ctx.fillRect(0, 0, 600, 850);
    ctx.fillStyle = "#e6ddc4";
    ctx.font = "18px sans-serif";
    ctx.fillText("SELECTED / WORK", 46, 61);
    ctx.font = "76px Georgia";
    ctx.fillText("Form &", 43, 162);
    ctx.fillText("feeling.", 43, 244);
    ctx.fillStyle = "#678983";
    ctx.fillRect(44, 306, 512, 328);
    ctx.strokeStyle = "#e6ddc4";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(300, 470, 50 + i * 17, 125, 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#e6ddc4";
    ctx.font = "23px sans-serif";
    ctx.fillText("A considered collection.", 45, 700);
    ctx.fillStyle = "#88998f";
    ctx.fillRect(45, 745, 390, 6);
    ctx.fillRect(45, 775, 310, 6);
  });
  face(display, 0.59, 0.83, [0, 1.45, -0.105], portfolioScreen);
  // The lamp and wall sconce share their light coordinates with Studio.
  const [lx, ly, lz] = studioLighting.task.position;
  box(
    structure,
    [0.14, 0.46, 0.09],
    [lx, ly, lz - 0.2],
    mats.beige,
    0.03,
    "left-wall-sconce",
  );
  box(
    structure,
    [0.065, 0.33, 0.03],
    [lx, ly, lz - 0.14],
    material(studioLighting.task.color, 0.4, 0, true),
    0.015,
  );
  const [sx, sy, sz] = studioLighting.accent.position;
  box(
    structure,
    [0.14, 0.46, 0.09],
    [sx, sy, sz - 0.2],
    mats.beige,
    0.03,
    "wall-sconce",
  );
  box(
    structure,
    [0.065, 0.33, 0.03],
    [sx, sy, sz - 0.14],
    material(studioLighting.accent.color, 0.4, 0, true),
    0.015,
  );
  const history = prop("experience", [-3.805, 0, 0.4]);
  for (let i = 0; i < 3; i++) {
    box(
      history,
      [0.055, 0.59, 1.12],
      [0.0275, 2.65 - i * 0.72, 0],
      mats.beige,
      0.02,
    );
    face(
      history,
      1.02,
      0.49,
      [0.057, 2.65 - i * 0.72, 0],
      label(["2025 — 26", "2025", "2021"][i], C.dark, C.pale),
      Math.PI / 2,
    );
  }
  box(
    structure,
    [0.55, 0.065, 1.05],
    [-3.5, 1.25, -1.65],
    mats.trim,
    0.025,
    "wall-shelf",
  );
  for (let i = 0; i < 4; i++)
    box(
      structure,
      [0.3, 0.36 + (i % 2) * 0.04, 0.11],
      [-3.52, 1.46, -1.97 + i * 0.16],
      i % 2 ? mats.beige : mats.teal,
      0.007,
    );
  for (const x of [-1.4, 1.4]) {
    cylinder(ceiling, 0.12, 0.12, 0.035, [x, 3.38, -1.7], mats.black);
    cylinder(ceiling, 0.012, 0.012, 0.45, [x, 3.14, -1.7], mats.trim);
    cylinder(ceiling, 0.1, 0.25, 0.21, [x, 2.81, -1.7], mats.beige);
  }
  ceiling.visible = false;
  return {
    root,
    structure,
    ceiling,
    props,
    materials,
    assetsReady: Promise.all(pending),
  };
}
