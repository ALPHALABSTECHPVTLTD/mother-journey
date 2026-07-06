"use client";
/* The Living Womb — warm in-utero 3D view (three.js r128) */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const skinMat = () => new THREE.MeshStandardMaterial({ color: 0xE8A28D, roughness: 0.52, emissive: 0x571a10, emissiveIntensity: 0.42 });
const skinDeep = () => new THREE.MeshStandardMaterial({ color: 0xD98876, roughness: 0.6, emissive: 0x4a140c, emissiveIntensity: 0.45 });

function limb(g, a, b, r1, r2, m) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const dir = new THREE.Vector3().subVectors(B, A), len = dir.length();
  const seg = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, len, 16, 1), m);
  seg.position.copy(A).addScaledVector(dir, 0.5);
  seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.add(seg);
  [[A, r1], [B, r2]].forEach(([p, r]) => {
    const j = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), m);
    j.position.copy(p); g.add(j);
  });
}

function buildEmbryo(week) {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xE59486, roughness: 0.45, transparent: true, opacity: 0.96, emissive: 0x5e1c12, emissiveIntensity: 0.5 });
  for (let i = 0; i < 11; i++) {
    const t = i / 10, ang = t * Math.PI * 1.55, rad = 0.52 - t * 0.16;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.3 * (1 - t * 0.82) + 0.045, 20, 16), skin);
    s.position.set(Math.sin(ang) * rad, Math.cos(ang) * rad - 0.08, 0);
    g.add(s);
  }
  for (let i = 1; i < 8; i++) {
    const t = i / 9, ang = t * Math.PI * 1.35, rad = 0.52 - t * 0.14;
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), skinDeep());
    b.position.set(Math.sin(ang) * (rad + 0.2), Math.cos(ang) * (rad + 0.2) - 0.08, 0);
    g.add(b);
  }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 26, 22), skin);
  head.position.set(0.05, 0.44, 0); g.add(head);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0x30121e, roughness: 0.25, emissive: 0x11060c, emissiveIntensity: 0.6 }));
  eye.position.set(0.24, 0.47, 0.28); g.add(eye);
  if (week >= 7)
    [[0.36, 0.02, 0.16], [0.28, -0.32, 0.16], [0.36, 0.02, -0.16], [0.28, -0.32, -0.16]].forEach(([x, y, z]) => {
      const bud = new THREE.Mesh(new THREE.SphereGeometry(week >= 8 ? 0.11 : 0.08, 12, 10), skin);
      bud.scale.set(1.3, 0.8, 0.8); bud.position.set(x, y, z); g.add(bud);
    });
  const yolk = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xF2D9B8, roughness: 0.3, transparent: true, opacity: 0.72, emissive: 0x6b4d26, emissiveIntensity: 0.45 }));
  yolk.position.set(0.5, -0.5, 0.1); g.add(yolk);
  limb(g, [0.32, -0.3, 0.05], [0.48, -0.44, 0.09], 0.035, 0.03, skinDeep());
  if (week >= 5) {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xC94A62, emissive: 0xB03050, emissiveIntensity: 1.15, roughness: 0.3 }));
    h.position.set(0.3, 0.05, 0.16); h.userData.heart = true; g.add(h);
  }
  g.rotation.z = -0.12;
  return g;
}

function buildFetus(week) {
  const g = new THREE.Group();
  const skin = skinMat(), skinD = skinDeep();
  const t = Math.min(1, (week - 9) / 31);
  const headR = 0.5 - 0.13 * t, chub = 0.85 + 0.3 * t;
  const prof = [[0.1, 0.5], [0.3, 0.42], [0.37, 0.24], [0.39, 0.02], [0.42 * chub, -0.22], [0.44 * chub, -0.42], [0.36, -0.6], [0.2, -0.72], [0.02, -0.78]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const torso = new THREE.Mesh(new THREE.LatheGeometry(prof, 30), skin);
  torso.rotation.x = 0.3; g.add(torso);
  const H = new THREE.Group();
  H.add(new THREE.Mesh(new THREE.SphereGeometry(headR, 30, 26), skin));
  const face = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.82, 26, 22), skin);
  face.position.set(0, -headR * 0.18, headR * 0.28); H.add(face);
  const chin = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.3, 18, 14), skin);
  chin.position.set(0, -headR * 0.72, headR * 0.5); H.add(chin);
  [-1, 1].forEach((sx) => {
    const lid = new THREE.Mesh(new THREE.TorusGeometry(headR * 0.14, headR * 0.028, 10, 24, Math.PI * 0.85), skinD);
    lid.position.set(sx * headR * 0.38, -headR * 0.08, headR * 0.92);
    lid.rotation.set(0.25, sx * 0.25, Math.PI * 1.08); H.add(lid);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.22, 16, 12), skin);
    cheek.position.set(sx * headR * 0.5, -headR * 0.4, headR * 0.68); H.add(cheek);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.16, 16, 12), skinD);
    ear.scale.set(0.45, 1, 0.75); ear.position.set(sx * headR * 0.96, -headR * 0.08, 0); H.add(ear);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.09, 12, 10), skin);
  nose.position.set(0, -headR * 0.22, headR); H.add(nose);
  const lips = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.11, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0xC96A6C, roughness: 0.4, emissive: 0x4a1616, emissiveIntensity: 0.4 }));
  lips.scale.set(1.5, 0.45, 0.7); lips.position.set(0, -headR * 0.48, headR * 0.94); H.add(lips);
  H.position.set(0, 0.52 + headR * 0.55, 0.14); H.rotation.x = 0.42; g.add(H);
  const armR = 0.085 * chub;
  limb(g, [0.36, 0.28, 0.08], [0.5, -0.04, 0.34], armR * 1.1, armR, skin);
  limb(g, [0.5, -0.04, 0.34], [0.16, 0.18, 0.5], armR, armR * 0.85, skin);
  limb(g, [-0.36, 0.28, 0.08], [-0.5, -0.04, 0.34], armR * 1.1, armR, skin);
  limb(g, [-0.5, -0.04, 0.34], [-0.16, 0.18, 0.5], armR, armR * 0.85, skin);
  [[0.14, 0.2, 0.54], [-0.14, 0.2, 0.54]].forEach(([x, y, z]) => {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1 * chub, 16, 12), skin);
    hand.scale.set(0.8, 1.15, 0.7); hand.position.set(x, y, z); g.add(hand);
  });
  const legR = 0.105 * chub;
  limb(g, [0.2, -0.6, 0.02], [0.42, -0.32, 0.42], legR * 1.15, legR, skin);
  limb(g, [0.42, -0.32, 0.42], [0.14, -0.52, 0.55], legR, legR * 0.8, skin);
  limb(g, [-0.2, -0.6, 0.02], [-0.42, -0.32, 0.42], legR * 1.15, legR, skin);
  limb(g, [-0.42, -0.32, 0.42], [-0.14, -0.52, 0.55], legR, legR * 0.8, skin);
  [[0.12, -0.56, 0.6], [-0.12, -0.56, 0.6]].forEach(([x, y, z]) => {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.105 * chub, 16, 12), skin);
    foot.scale.set(0.75, 0.6, 1.5); foot.position.set(x, y, z + 0.02); g.add(foot);
  });
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0xC94A62, emissive: 0xB03050, emissiveIntensity: 1.0, transparent: true, opacity: 0.92, roughness: 0.3 }));
  h.position.set(0.07, 0.12, 0.32); h.userData.heart = true; g.add(h);
  g.rotation.z = -0.06;
  return g;
}

function buildBaby(week) {
  const g = week < 9 ? buildEmbryo(week) : buildFetus(week);
  const t = Math.min(1, Math.max(0, (week - 4) / 36));
  const scale = 0.26 + 1.04 * Math.pow(t, 1.3);
  if (week >= 36) { g.rotation.z += Math.PI; g.rotation.y += 0.3; }
  g.scale.setScalar(scale);
  g.userData.targetScale = scale;
  return g;
}

function wombTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const x = c.getContext("2d");
  const grad = x.createRadialGradient(256, 236, 50, 256, 256, 330);
  grad.addColorStop(0, "#B25560"); grad.addColorStop(0.5, "#7E2B36"); grad.addColorStop(1, "#3C0B12");
  x.fillStyle = grad; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1100; i++) {
    x.fillStyle = `rgba(${170 + Math.random() * 60},${55 + Math.random() * 35},${65 + Math.random() * 30},${Math.random() * 0.09})`;
    x.beginPath(); x.arc(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 24, 0, 7); x.fill();
  }
  x.strokeStyle = "rgba(190,80,90,0.16)";
  for (let i = 0; i < 26; i++) {
    x.lineWidth = 0.8 + Math.random() * 1.6; x.beginPath();
    let px = Math.random() * 512, py = Math.random() * 512; x.moveTo(px, py);
    for (let s = 0; s < 6; s++) { px += (Math.random() - 0.5) * 90; py += (Math.random() - 0.5) * 90; x.lineTo(px, py); }
    x.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function buildCord(from, mid, to, radius) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0xD9C6D6, roughness: 0.35, emissive: 0x3d2a3d, emissiveIntensity: 0.35 });
  const A = new THREE.Vector3(...from), B = new THREE.Vector3(...mid), C = new THREE.Vector3(...to);
  for (let i = 0; i <= 46; i++) {
    const t = i / 46;
    const p = new THREE.Vector3().copy(A).multiplyScalar((1 - t) * (1 - t))
      .addScaledVector(B, 2 * (1 - t) * t).addScaledVector(C, t * t);
    p.x += Math.sin(t * 22) * radius * 0.75; p.y += Math.cos(t * 22) * radius * 0.75;
    const s = new THREE.Mesh(new THREE.SphereGeometry(radius * (1 - t * 0.25), 12, 10), m);
    s.position.copy(p); g.add(s);
  }
  return g;
}

export default function LivingWomb({ week }) {
  const mountRef = useRef(null);
  const S = useRef({}).current;

  useEffect(() => {
    const mount = mountRef.current;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 60);
    camera.position.set(0, 0.1, 6.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xFFD9C2, 0.32));
    const key = new THREE.DirectionalLight(0xFFB187, 0.55); key.position.set(3, 4, 5); scene.add(key);
    const warm = new THREE.PointLight(0xFF7A4D, 2.1, 14); warm.position.set(0.6, 1.8, 2.8); scene.add(warm);
    const inner = new THREE.PointLight(0xFFC49A, 1.15, 7); inner.position.set(0, 0.2, 1.4); scene.add(inner);
    const fill = new THREE.PointLight(0x7A3D5A, 0.6, 12); fill.position.set(-3.2, -1.2, -2.4); scene.add(fill);

    const wall = new THREE.Mesh(new THREE.SphereGeometry(3.05, 56, 40),
      new THREE.MeshStandardMaterial({ map: wombTexture(), side: THREE.BackSide, roughness: 0.92, emissive: 0x33080d, emissiveIntensity: 0.6 }));
    scene.add(wall);
    const fluid = new THREE.Mesh(new THREE.SphereGeometry(2.7, 40, 30),
      new THREE.MeshBasicMaterial({ color: 0xFF8A5C, transparent: true, opacity: 0.055, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(fluid);
    const plac = new THREE.Mesh(new THREE.SphereGeometry(0.85, 30, 24),
      new THREE.MeshStandardMaterial({ color: 0x8E3040, roughness: 0.7, emissive: 0x3d0d16, emissiveIntensity: 0.7 }));
    plac.scale.set(1.15, 0.42, 1.15); plac.position.set(-1.85, 1.15, -1.55); plac.lookAt(0, 0, 0);
    scene.add(plac);

    const N = 120, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 1.0 + Math.random() * 1.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph); pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xFFD9BE, size: 0.03, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(particles);

    const pivot = new THREE.Group(); scene.add(pivot);
    Object.assign(S, { scene, camera, renderer, pivot, particles, rotY: 0, rotX: 0, targetY: 0, targetX: 0, dragging: false, lastX: 0, lastY: 0, popped: 1, raf: 0, t0: performance.now() });

    const el = renderer.domElement;
    el.style.touchAction = "none"; el.style.cursor = "grab";
    const down = (e) => { S.dragging = true; S.lastX = e.clientX; S.lastY = e.clientY; el.style.cursor = "grabbing"; };
    const move = (e) => {
      if (!S.dragging) return;
      S.targetY += (e.clientX - S.lastX) * 0.006;
      S.targetX = Math.max(-0.65, Math.min(0.65, S.targetX + (e.clientY - S.lastY) * 0.004));
      S.lastX = e.clientX; S.lastY = e.clientY;
    };
    const up = () => { S.dragging = false; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    const loop = () => {
      S.raf = requestAnimationFrame(loop);
      const t = (performance.now() - S.t0) / 1000;
      if (!S.dragging) S.targetY += 0.0018;
      S.rotY += (S.targetY - S.rotY) * 0.08; S.rotX += (S.targetX - S.rotX) * 0.08;
      pivot.rotation.set(S.rotX, S.rotY, 0);
      pivot.position.y = Math.sin(t * 0.85) * 0.06;
      particles.rotation.y = t * 0.045;
      if (S.baby) {
        S.popped += (1 - S.popped) * 0.12;
        S.baby.scale.setScalar(S.baby.userData.targetScale * S.popped);
        S.baby.traverse((o) => { if (o.userData.heart) o.scale.setScalar(1 + Math.max(0, Math.sin(t * 5.2)) * 0.35); });
      }
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(S.raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointerdown", down);
      renderer.dispose();
      mount.removeChild(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!S.pivot) return;
    while (S.pivot.children.length) {
      const c = S.pivot.children[0];
      S.pivot.remove(c);
      c.traverse?.((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
    }
    const baby = buildBaby(week);
    S.baby = baby; S.popped = 0.7;
    S.pivot.add(baby);
    if (week >= 9) {
      const sc = baby.userData.targetScale;
      S.pivot.add(buildCord([0.08 * sc, -0.45 * sc, 0.3 * sc], [0.2, -0.9, 0.4], [-1.5, 0.95, -1.25], 0.05 + 0.02 * sc));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  return (
    <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "radial-gradient(circle at 50% 42%, #6B2029 0%, #3A0D13 55%, #1C0508 100%)" }}>
      <div ref={mountRef} style={{ width: "100%", height: "min(56vh, 460px)" }} aria-label={`3D womb view at week ${week}`} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 45%, transparent 46%, rgba(20,3,6,.55) 100%)" }} />
    </div>
  );
}
