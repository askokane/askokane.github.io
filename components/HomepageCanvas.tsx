'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Uniform distribution of n points on a sphere of radius r (Fibonacci lattice) */
function fibonacciSphere(n: number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const gr = (1 + Math.sqrt(5)) / 2; // golden ratio
  for (let i = 0; i < n; i++) {
    const phi   = Math.acos(1 - 2 * (i + 0.5) / n);
    const theta = 2 * Math.PI * i / gr;
    pts.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ));
  }
  return pts;
}

export function HomepageCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      500,
    );
    camera.position.set(0, 0, 30);

    const group = new THREE.Group();
    scene.add(group);

    // ── Node graph (neural-network / dependency-graph aesthetic) ──
    const nodeCount = isMobile ? 42 : 72;
    const nodes     = fibonacciSphere(nodeCount, 10);

    // Points for all nodes
    const nodePosArr = new Float32Array(nodeCount * 3);
    nodes.forEach((v, i) => {
      nodePosArr[i * 3]     = v.x;
      nodePosArr[i * 3 + 1] = v.y;
      nodePosArr[i * 3 + 2] = v.z;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: isMobile ? 0.22 : 0.28,
      transparent: true,
      opacity: 0.92,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // Edges — connect nodes within distance threshold
    const distThreshold = isMobile ? 7.2 : 8.0;
    const edgeVerts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < distThreshold) {
          edgeVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          edgeVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(edgeVerts), 3),
    );
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.16,
    });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ── Orbiting rings (electron-orbit / computational metaphor) ──
    const makeRing = (count: number, radius: number, opacity: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        pos[i * 3]     = radius * Math.cos(a);
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = radius * Math.sin(a);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.08,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return { mesh: new THREE.Points(geo, mat), geo, mat };
    };

    const r1 = makeRing(90, 13.5, 0.38);
    r1.mesh.rotation.x = Math.PI / 3;
    scene.add(r1.mesh);

    const r2 = makeRing(70, 14.5, 0.24);
    r2.mesh.rotation.z = Math.PI / 5;
    scene.add(r2.mesh);

    const r3 = makeRing(55, 12.5, 0.18);
    r3.mesh.rotation.x = -Math.PI / 6;
    r3.mesh.rotation.z =  Math.PI / 4;
    scene.add(r3.mesh);

    // ── Mouse parallax ────────────────────────────────────
    let mx = 0, my = 0, camX = 0, camY = 0;
    const onMove = (e: MouseEvent) => {
      mx =  e.clientX / window.innerWidth  - 0.5;
      my =  e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0, t = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!reduced) {
        t += 0.004;

        // Rotate graph
        group.rotation.y = t * 0.28;
        group.rotation.x = t * 0.11;

        // Counter-rotate rings for contrast
        r1.mesh.rotation.y =  t * 0.55;
        r2.mesh.rotation.y = -t * 0.40;
        r3.mesh.rotation.y =  t * 0.32;

        // Smooth camera drift toward mouse
        camX += (mx * 4   - camX) * 0.032;
        camY += (-my * 2.5 - camY) * 0.032;
        camera.position.x = camX;
        camera.position.y = camY;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      nodeGeo.dispose(); nodeMat.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      r1.geo.dispose(); r1.mat.dispose();
      r2.geo.dispose(); r2.mat.dispose();
      r3.geo.dispose(); r3.mat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
