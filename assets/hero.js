/* ============================================================
   hero.js — scroll-driven morphing wireframe (three.js)
   monochrome · reacts to scroll + pointer
   loaded as <script type="module"> via importmap("three")
   ============================================================ */
import * as THREE from 'three';

const mount = document.getElementById('hero-canvas');
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (mount) {
  const W = () => mount.clientWidth || window.innerWidth;
  const H = () => mount.clientHeight || window.innerHeight;
  const isMobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, W() / H(), 0.1, 500);
  camera.position.set(0, 0, 30);

  const group = new THREE.Group();
  scene.add(group);

  const RADIUS = 9;

  // ── morphing wireframe icosahedron ──
  const geo = new THREE.IcosahedronGeometry(RADIUS, isMobile ? 3 : 5);
  const posAttr = geo.attributes.position;
  const count = posAttr.count;
  const base = new Float32Array(posAttr.array);          // pristine copy
  const dir = new Float32Array(count * 3);                // normalised direction
  for (let i = 0; i < count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    dir[i * 3] = x / len; dir[i * 3 + 1] = y / len; dir[i * 3 + 2] = z / len;
  }

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, wireframe: true, transparent: true, opacity: 0.42
  });
  const mesh = new THREE.Mesh(geo, wireMat);
  group.add(mesh);

  // ── inner counter-rotating octahedron ──
  const octGeo = new THREE.OctahedronGeometry(RADIUS * 0.52, 0);
  const oct = new THREE.LineSegments(
    new THREE.WireframeGeometry(octGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );
  octGeo.dispose();
  group.add(oct);

  // ── vertex point cloud (sparse, additive sparkle) ──
  const ptCount = isMobile ? 220 : 420;
  const ptPos = new Float32Array(ptCount * 3);
  const ptIdx = new Int32Array(ptCount);
  for (let i = 0; i < ptCount; i++) {
    const v = Math.floor((i / ptCount) * count);
    ptIdx[i] = v;
    ptPos[i * 3] = base[v * 3]; ptPos[i * 3 + 1] = base[v * 3 + 1]; ptPos[i * 3 + 2] = base[v * 3 + 2];
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
  const ptMat = new THREE.PointsMaterial({
    color: 0xffffff, size: isMobile ? 0.1 : 0.13, transparent: true, opacity: 0.9,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const points = new THREE.Points(ptGeo, ptMat);
  group.add(points);

  // ── faint perspective floor grid ──
  const gSize = 60, gDiv = 30, gStep = gSize / gDiv, gv = [];
  for (let i = 0; i <= gDiv; i++) {
    const p = -gSize / 2 + i * gStep;
    gv.push(-gSize / 2, -15, p, gSize / 2, -15, p);
    gv.push(p, -15, -gSize / 2, p, -15, gSize / 2);
  }
  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gv), 3));
  const grid = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 }));
  scene.add(grid);

  // ── displacement ──
  function displace(t, amp) {
    const arr = posAttr.array;
    for (let i = 0; i < count; i++) {
      const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];
      let n =
        Math.sin(bx * 0.42 + t * 0.7) * Math.cos(by * 0.42 + t * 0.6) * Math.sin(bz * 0.42 + t * 0.5);
      n += 0.45 * Math.sin(by * 0.8 - t * 0.9);
      n += 0.25 * Math.cos(bx * 1.3 + bz * 0.9 + t * 0.4);
      const f = 1 + (n * amp) / RADIUS;
      arr[i * 3] = bx * f; arr[i * 3 + 1] = by * f; arr[i * 3 + 2] = bz * f;
    }
    posAttr.needsUpdate = true;
    // sync point cloud to a subset
    const pa = ptGeo.attributes.position.array;
    for (let i = 0; i < ptCount; i++) {
      const v = ptIdx[i];
      pa[i * 3] = arr[v * 3]; pa[i * 3 + 1] = arr[v * 3 + 1]; pa[i * 3 + 2] = arr[v * 3 + 2];
    }
    ptGeo.attributes.position.needsUpdate = true;
  }

  // ── state ──
  let progress = 0, targetProgress = 0;
  let mx = 0, my = 0, camX = 0, camY = 0;
  let revealed = reduced || !!window.__heroRevealReady; // if reduced or reveal already fired, treat as ready
  let intro = revealed ? 1 : 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  });

  function resize() {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  }
  window.addEventListener('resize', resize);

  // ── scroll binding (driven by site.js pinned hero via window.__heroProgress) ──
  function bindScroll() { /* progress now read from window.__heroProgress in frame() */ }

  // ── entrance ──
  window.addEventListener('hero:reveal', () => {
    revealed = true;
    if (reduced || !gsap) { intro = 1; bindScroll(); return; }
    gsap.fromTo({ v: 0 }, { v: 0 }, {
      v: 1, duration: 1.6, ease: 'expo.out',
      onUpdate: function () { intro = this.targets()[0].v; }
    });
    group.rotation.y = -0.8;
    gsap.to(group.rotation, { y: 0, duration: 2.0, ease: 'expo.out' });
    bindScroll();
  });
  // safety: reveal even if event missed
  setTimeout(() => { if (!revealed) { revealed = true; intro = 1; bindScroll(); } }, 4000);

  // ── theme (dark lines on light paper, and back) ──
  function applyTheme() {
    var light = document.documentElement.classList.contains('light');
    var c = light ? 0x14130f : 0xffffff;
    wireMat.color.setHex(c);
    oct.material.color.setHex(c);
    grid.material.color.setHex(c);
    ptMat.color.setHex(c);
    ptMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    ptMat.needsUpdate = true;
  }
  applyTheme();
  window.addEventListener('themechange', applyTheme);

  // ── per-frame ──
  let t = 0;
  function frame() {
    if (!reduced) {
      t += 0.006;
      targetProgress = window.__heroProgress || 0;
      progress += (targetProgress - progress) * 0.06;

      const amp = 0.55 + progress * 3.0;     // calm → spiky as you scroll
      displace(t, amp * intro + 0.15);

      group.rotation.y = t * 0.12 + progress * 0.6;
      group.rotation.x = Math.sin(t * 0.18) * 0.12 + progress * 0.25;
      oct.rotation.x = -t * 0.22;
      oct.rotation.z = t * 0.16;
      points.rotation.copy(group.rotation);

      const sc = 0.55 + 0.45 * intro;
      group.scale.setScalar(sc);
      points.scale.setScalar(sc);

      // opacity: fade in on intro, fade out as scrolled
      const fade = intro * (1 - progress * 0.8);
      wireMat.opacity = 0.42 * fade;
      ptMat.opacity = 0.9 * fade;
      oct.material.opacity = 0.5 * fade;
      grid.material.opacity = 0.12 * (1 - progress);

      camX += (mx * 4 - camX) * 0.04;
      camY += (-my * 2.6 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.position.z = 30 - progress * 9;
      camera.lookAt(0, 0, 0);
    } else {
      displace(0, 0.6);
    }
    renderer.render(scene, camera);
  }
  function tick() { requestAnimationFrame(tick); frame(); }
  tick();

  // verification hook: drive frames synchronously when rAF is throttled
  window.__heroKick = function (frames, prog) {
    revealed = true; intro = 1;
    if (typeof prog === 'number') { progress = prog; targetProgress = prog; }
    for (let i = 0; i < (frames || 60); i++) frame();
    return { intro: intro, progress: progress, t: t };
  };
}
