import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRoom, roomTargets } from "./room-scene";
import { studioLighting } from "./room-lighting";

type Props = {
  selectedId: string | null;
  reset: number;
  review?: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onReady: () => void;
  onError: () => void;
};

export default function Studio(props: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const actions = useRef<{
    reset: () => void;
    highlight: (id: string | null) => void;
  } | null>(null);
  const callbacks = useRef(props);
  callbacks.current = props;
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: Boolean(props.review),
      });
    } catch {
      callbacks.current.onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive studio. Drag to look around; use the collection buttons to explore each project and your experience.",
    );
    renderer.domElement.setAttribute("role", "img");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const review = props.review;
    const isPlan =
      review === "plan" ||
      review === "ceiling" ||
      review === "back" ||
      review === "left";
    const camera = new THREE.OrthographicCamera(-6.8, 6.8, 5.4, -5.4, 0.1, 100);
    camera.position.set(10, 8.5, 12);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.9, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.7;
    controls.minAzimuthAngle = 0.15;
    controls.maxAzimuthAngle = 1.15;
    controls.rotateSpeed = 0.45;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.update();
    const room = createRoom();
    scene.add(room.root);

    scene.add(new THREE.HemisphereLight("#b6cdd3", "#171b30", 1.25));
    const key = new THREE.DirectionalLight("#ffe8bb", 4.2);
    key.position.set(-3, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.00015;
    key.shadow.camera.far = 25;
    scene.add(key);
    const fill = new THREE.DirectionalLight("#8abcc6", 1.8);
    fill.position.set(5, 4, -2);
    scene.add(fill);
    Object.values(studioLighting).forEach((spec) => {
      const light = new THREE.PointLight(
        spec.color,
        spec.intensity,
        spec.distance,
        2,
      );
      light.position.set(...spec.position);
      scene.add(light);
    });

    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.14 }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = -0.46;
    contact.receiveShadow = true;
    scene.add(contact);
    if (review) {
      controls.enabled = false;
      if (review === "plan") {
        camera.position.set(0, 15, 0);
        camera.up.set(0, 0, -1);
        controls.target.set(0, 0, 0);
      }
      if (review === "ceiling") {
        room.structure.visible = false;
        Object.values(room.props).forEach((p) => {
          p.visible = false;
        });
        room.ceiling.visible = true;
        room.ceiling.getObjectByName("cutaway-ceiling")!.visible = true;
        camera.position.set(0, -12, 0);
        camera.up.set(0, 0, -1);
        controls.target.set(0, 3.4, 0);
      }
      if (review === "back") {
        camera.position.set(0, 1.7, 18);
        controls.target.set(0, 1.7, -3);
      }
      if (review === "left") {
        camera.position.set(18, 1.7, 0);
        controls.target.set(-3.8, 1.7, 0);
      }
      if (review === "props" || review.startsWith("prop-")) {
        room.structure.visible = false;
        contact.visible = false;
        const entries = Object.entries(room.props);
        entries.forEach(([id, object], i) => {
          if (review.startsWith("prop-")) {
            object.visible = id === review.slice(5);
            object.position.set(0, 0, 0);
            if (id === "experience") object.rotation.y = -Math.PI / 2;
          } else {
            object.position.set(
              (i % 3) * 3.8 - 3.8,
              0,
              Math.floor(i / 3) * 4.3 - 2.15,
            );
            if (id === "experience") object.rotation.y = -Math.PI / 2;
          }
        });
        if (review.startsWith("prop-")) {
          camera.zoom = 2.15;
          controls.target.set(0, 1.2, 0);
          camera.updateProjectionMatrix();
        }
      }
      camera.lookAt(controls.target);
      if (isPlan) {
        scene.background = new THREE.Color("#ffffff");
        contact.visible = false;
        const meshes: THREE.Mesh[] = [];
        room.root.traverse((object) => {
          if (object instanceof THREE.Mesh) meshes.push(object);
        });
        meshes.forEach((object) => {
          object.material = new THREE.MeshBasicMaterial({
            color: "#f5f5f5",
            toneMapped: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
          });
          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(object.geometry, 1),
            new THREE.LineBasicMaterial({
              color: "#252525",
              toneMapped: false,
            }),
          );
          object.add(edges);
        });
      }
    }

    const labelHost = document.createElement("div");
    labelHost.className = "hotspot-layer";
    const hotspots: { id: string; button: HTMLButtonElement }[] = [];
    const labels: Record<string, string> = {
      blackrose: "Black Rose",
      predikta: "PREDIKTA",
      portfolio: "Client portfolios",
      experience: "Experience",
    };
    if (!review) {
      Object.keys(roomTargets).forEach((id) => {
        const button = document.createElement("button");
        button.className = `room-hotspot hotspot-${id}`;
        button.setAttribute("aria-label", `Explore ${labels[id]}`);
        const dot = document.createElement("span");
        dot.className = "hotspot-dot";
        dot.textContent = "+";
        dot.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.className = "hotspot-label";
        label.textContent = labels[id];
        button.append(dot, label);
        button.onclick = () => callbacks.current.onSelect(id);
        button.onfocus = () => callbacks.current.onHover(id);
        button.onblur = () => callbacks.current.onHover(null);
        button.onmouseenter = () => callbacks.current.onHover(id);
        button.onmouseleave = () => callbacks.current.onHover(null);
        labelHost.appendChild(button);
        hotspots.push({ id, button });
      });
      host.appendChild(labelHost);
    }
    let disposed = false;
    function render() {
      if (disposed) return;
      renderer.render(scene, camera);
      host!.dataset.triangles = String(renderer.info.render.triangles);
      hotspots.forEach(({ id, button }) => {
        const v = roomTargets[id].clone().project(camera);
        button.style.left = `${(v.x * 0.5 + 0.5) * host!.clientWidth}px`;
        button.style.top = `${(-v.y * 0.5 + 0.5) * host!.clientHeight}px`;
      });
    }
    function resize() {
      const width = host!.clientWidth,
        height = host!.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      const aspect = width / height;
      const halfWidth = Math.max(6.4, 4.8 * aspect);
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfWidth / aspect;
      camera.bottom = -halfWidth / aspect;
      camera.updateProjectionMatrix();
      render();
    }
    controls.addEventListener("change", render);
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let startX = 0,
      startY = 0;
    function pick(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(
        room.root.children,
        true,
      );
      for (const hit of intersections) {
        let object: THREE.Object3D | null = hit.object;
        let visible = true,
          id: string | null = null;
        while (object) {
          if (!object.visible) visible = false;
          if (object.userData.exhibit) id = object.userData.exhibit;
          object = object.parent;
        }
        if (visible) return id; // Do not select through an intervening wall or furniture.
      }
      return null;
    }
    function down(event: PointerEvent) {
      startX = event.clientX;
      startY = event.clientY;
    }
    function up(event: PointerEvent) {
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 6)
        return;
      const id = pick(event);
      if (id) callbacks.current.onSelect(id);
    }
    function move(event: PointerEvent) {
      if (event.buttons) return;
      const id = pick(event);
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
      callbacks.current.onHover(id);
    }
    function leave() {
      callbacks.current.onHover(null);
    }
    function contextLost(event: Event) {
      event.preventDefault();
      callbacks.current.onError();
    }
    if (!review) {
      renderer.domElement.addEventListener("pointerdown", down);
      renderer.domElement.addEventListener("pointerup", up);
      renderer.domElement.addEventListener("pointermove", move);
      renderer.domElement.addEventListener("pointerleave", leave);
    }
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    actions.current = {
      reset() {
        camera.position.set(10, 8.5, 12);
        controls.target.set(0, 0.9, 0);
        controls.update();
        render();
      },
      highlight(id) {
        hotspots.forEach((h) =>
          h.button.classList.toggle("active", h.id === id),
        );
      },
    };
    resize();
    void room.assetsReady.then(() => {
      if (!disposed) {
        render();
        callbacks.current.onReady();
        host.dataset.ready = "true";
      }
    });
    return () => {
      disposed = true;
      actions.current = null;
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>(room.materials);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((m) => materials.add(m));
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => {
        const map = (m as THREE.MeshBasicMaterial).map;
        map?.dispose();
        m.dispose();
      });
      renderer.dispose();
      host.replaceChildren();
      delete host.dataset.ready;
    };
  }, [props.review]);
  useEffect(() => {
    if (!props.review) actions.current?.reset();
  }, [props.reset, props.review]);
  useEffect(() => {
    actions.current?.highlight(props.selectedId);
  }, [props.selectedId]);
  return <div className="room-canvas" ref={mount} />;
}
