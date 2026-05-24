'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three independently-rotating rings (armillary-sphere style) + particle shell.
 * Used as a decorative corner element on the blog index page.
 */
export function BlogScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = 300, H = 300;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 5.5;

    // Helper: thin torus ring
    function ring(tube: number, opacity: number, rx: number, rz: number) {
      const geo = new THREE.TorusGeometry(1.8, tube, 8, 100);
      const mat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = rx;
      mesh.rotation.z = rz;
      scene.add(mesh);
      return { mesh, geo, mat };
    }

    const r1 = ring(0.018, 0.55, 0,              0);
    const r2 = ring(0.013, 0.38, Math.PI / 2,    0);
    const r3 = ring(0.009, 0.26, Math.PI / 4,    Math.PI / 3);

    // Central glow sphere
    const sGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const sMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Mesh(sGeo, sMat));

    // Shell particles
    const pGeo = new THREE.BufferGeometry();
    const pos: number[] = [];
    for (let i = 0; i < 80; i++) {
      const r = 2.0 + Math.random() * 1.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.028, transparent: true, opacity: 0.65 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let id: number;
    let t = 0;

    function animate() {
      id = requestAnimationFrame(animate);
      if (!reduced) {
        t += 0.003;
        r1.mesh.rotation.y = t * 0.42;
        r1.mesh.rotation.z = t * 0.14;
        r2.mesh.rotation.x = Math.PI / 2 + t * 0.27;
        r2.mesh.rotation.y = t * 0.33;
        r3.mesh.rotation.x = Math.PI / 4 + t * 0.19;
        r3.mesh.rotation.z = Math.PI / 3 + t * 0.31;
        particles.rotation.y = t * 0.05;
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(id);
      renderer.dispose();
      [r1.geo, r1.mat, r2.geo, r2.mat, r3.geo, r3.mat, sGeo, sMat, pGeo, pMat].forEach(o => o.dispose());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}
