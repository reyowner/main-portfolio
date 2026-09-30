import AiLoader from "./components/ui/ai-loader";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const layers = [
  {
    name: "Interface",
    description: "Considered details. Intuitive interactions.",
  },
  {
    name: "Logic",
    description: "Connecting the experience to what makes it work.",
  },
  {
    name: "Data",
    description: "A reliable foundation for everything above it.",
  },
];

export default function Hologram() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{
    layer: (i: number) => void;
    expand: (value: boolean) => void;
    rotate: (direction: number) => void;
    reset: () => void;
  } | null>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      "Holographic three-layer system. Drag to rotate, or use the rotate and layer buttons below.",
    );
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(4.5, 3.5, 6.8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = false;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 2.05;
    controls.target.set(0, 0, 0);
    controls.update();
    const system = new THREE.Group();
    scene.add(system);
    const glow = "#94c1b4",
      cream = "#e6ddc4";
    const groups: THREE.Group[] = [];
    const lineMats: THREE.LineBasicMaterial[] = [];
    const plateMats: THREE.MeshBasicMaterial[] = [];
    const baseY = [0.68, 0, -0.68];
    const materials: THREE.Material[] = [];
    function wire(
      geometry: THREE.BufferGeometry,
      color: string,
      opacity: number,
    ) {
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(mat);
      const edges = new THREE.EdgesGeometry(geometry);
      geometry.dispose();
      return new THREE.LineSegments(edges, mat);
    }
    function ring(
      radius: number,
      rotation: number[],
      opacity: number,
      arc = Math.PI * 2,
    ) {
      const points = Array.from(
        { length: 161 },
        (_, i) =>
          new THREE.Vector3(
            Math.cos((i / 160) * arc) * radius,
            0,
            Math.sin((i / 160) * arc) * radius,
          ),
      );
      const mat = new THREE.LineBasicMaterial({
        color: glow,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      materials.push(mat);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        mat,
      );
      line.rotation.set(...(rotation as [number, number, number]));
      system.add(line);
      return line;
    }
    // Three layers are the interface, application logic, and data in Renato's stack.
    baseY.forEach((y, i) => {
      const group = new THREE.Group();
      group.position.y = y;
      system.add(group);
      groups.push(group);
      const plateMat = new THREE.MeshBasicMaterial({
        color: glow,
        transparent: true,
        opacity: 0.045,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      plateMats.push(plateMat);
      materials.push(plateMat);
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.075, 1.7),
        plateMat,
      );
      group.add(plate);
      const frame = wire(
        new THREE.BoxGeometry(1.7, 0.075, 1.7),
        glow,
        i === 0 ? 0.95 : 0.3,
      );
      group.add(frame);
      lineMats.push(frame.material as THREE.LineBasicMaterial);
      const inset = wire(new THREE.BoxGeometry(1.35, 0.018, 1.35), cream, 0.28);
      inset.position.y = 0.07;
      group.add(inset);
      for (let x = -3; x <= 3; x++) {
        const trace = wire(
          new THREE.BoxGeometry(0.023, 0.005, 0.34 + (Math.abs(x) % 3) * 0.16),
          glow,
          0.28,
        );
        trace.position.set(x * 0.19, 0.052, 0.24);
        group.add(trace);
      }
      for (const x of [-0.66, 0.66])
        for (const z of [-0.66, 0.66]) {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.027, 8, 8),
            new THREE.MeshBasicMaterial({ color: cream }),
          );
          dot.position.set(x, 0.075, z);
          group.add(dot);
        }
    });
    const core = wire(new THREE.IcosahedronGeometry(0.41, 0), cream, 0.9);
    system.add(core);
    const inner = wire(new THREE.IcosahedronGeometry(0.28, 0), glow, 0.35);
    inner.rotation.y = 0.5;
    system.add(inner);
    ring(1.9, [0.18, 0, 0.08], 0.55, Math.PI * 1.83);
    ring(2.13, [0.92, 0.4, -0.2], 0.22, Math.PI * 1.74);
    ring(2.23, [-0.58, -0.45, 0.25], 0.18);
    const ground = ring(1.64, [0, 0, 0], 0.23);
    ground.position.y = -1.45;
    const ground2 = ring(1.8, [0, 0, 0], 0.12);
    ground2.position.y = -1.45;
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const points = [
        new THREE.Vector3(Math.cos(a) * 1.64, -1.45, Math.sin(a) * 1.64),
        new THREE.Vector3(
          Math.cos(a) * (i % 5 ? 1.7 : 1.77),
          -1.45,
          Math.sin(a) * (i % 5 ? 1.7 : 1.77),
        ),
      ];
      const mat = new THREE.LineBasicMaterial({
        color: glow,
        transparent: true,
        opacity: 0.35,
      });
      materials.push(mat);
      system.add(
        new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat),
      );
    }
    for (const [x, z] of [
      [-0.66, -0.66],
      [0.66, 0.66],
    ]) {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, -1.2, z),
          new THREE.Vector3(x, 1.2, z),
        ]),
        new THREE.LineDashedMaterial({
          color: glow,
          transparent: true,
          opacity: 0.4,
          dashSize: 0.04,
          gapSize: 0.06,
        }),
      );
      line.computeLineDistances();
      system.add(line);
    }
    let visible = true,
      disposed = false,
      frame = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function render() {
      if (!disposed && visible) {
        renderer.render(scene, camera);
        el.dataset.rotation = system.rotation.y.toFixed(3);
      }
    }
    function resize() {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) render();
    });
    intersection.observe(el);
    controls.addEventListener("change", render);
    function animateExpand(value: boolean) {
      cancelAnimationFrame(frame);
      const starts = groups.map((g) => g.position.y);
      const target = baseY.map((y) => y * (value ? 1.65 : 1));
      const start = performance.now();
      function step(now: number) {
        if (disposed) return;
        const t = reduced.matches ? 1 : Math.min(1, (now - start) / 450);
        const ease = 1 - (1 - t) ** 3;
        groups.forEach((g, i) => {
          g.position.y = starts[i] + (target[i] - starts[i]) * ease;
        });
        render();
        if (t < 1) frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    }
    api.current = {
      layer(index) {
        lineMats.forEach((m, i) => {
          m.opacity = i === index ? 1 : 0.24;
          m.color.set(i === index ? cream : glow);
        });
        plateMats.forEach((m, i) => {
          m.opacity = i === index ? 0.12 : 0.035;
        });
        render();
      },
      expand: animateExpand,
      rotate(direction) {
        system.rotation.y += (direction * Math.PI) / 8;
        render();
      },
      reset() {
        camera.position.set(4.5, 3.5, 6.8);
        system.rotation.set(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
        render();
      },
    };
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    resize();
    api.current.layer(0);
    el.dataset.ready = "true";
    setReady(true);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      controls.dispose();
      api.current = null;
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const geos = new Set<THREE.BufferGeometry>(),
        mats = new Set<THREE.Material>(materials);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          geos.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            mats.add(m),
          );
        }
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      el.replaceChildren();
    };
  }, []);

  return (
    <div className="hologram">
      <div className="holo-topline">
        <span>
          <i />A full-stack perspective
        </span>
        <span aria-hidden="true">⌖</span>
      </div>
      <div className="holo-stage" ref={host} />
      {!ready && !failed && <AiLoader text="Loading hologram" />}
      {failed ? (
        <div className="holo-fallback">
          <span>〈 / 〉</span>
          <p>
            Interface. Logic. Data.
            <br />
            Built to work together.
          </p>
        </div>
      ) : (
        <>
          <div className="holo-annotation annotation-top">
            <span>01</span> Interface
          </div>
          <div className="holo-annotation annotation-bottom">
            <span>03</span> Foundation
          </div>
          <div className="holo-tools">
            <button
              aria-label="Rotate hologram left"
              onClick={() => api.current?.rotate(-1)}
            >
              ↶
            </button>
            <span>Drag to rotate</span>
            <button
              aria-label="Rotate hologram right"
              onClick={() => api.current?.rotate(1)}
            >
              ↷
            </button>
            <button
              className="expand-holo"
              aria-pressed={expanded}
              onClick={() => {
                setExpanded(!expanded);
                api.current?.expand(!expanded);
              }}
            >
              {expanded ? "Assemble" : "Expand layers"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
            <button
              aria-label="Reset hologram"
              onClick={() => api.current?.reset()}
            >
              ⟲
            </button>
          </div>
          <div
            className="holo-layers"
            role="group"
            aria-label="Explore the system layers"
          >
            {layers.map((layer, i) => (
              <button
                key={layer.name}
                aria-pressed={active === i}
                onClick={() => {
                  setActive(i);
                  api.current?.layer(i);
                }}
              >
                {layer.name}
              </button>
            ))}
          </div>
          <p className="holo-description" aria-live="polite">
            {layers[active].description}
          </p>
        </>
      )}
    </div>
  );
}
