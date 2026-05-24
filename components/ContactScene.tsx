'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Wireframe (2,3) torus knot + orbit ring + particles.
 * Used as the decorative 3D element on the contact page.
 */
export function ContactScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = 380, H = 380;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.5;

    // (2,3) torus knot — trefoil-like, elegant
    const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.28, 220, 18, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.52,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.007, 8, 90);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.22 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Second tilted ring
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.005, 8, 90);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.14 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pPos: number[] = [];
    for (let i = 0; i < 65; i++) {
      const r = 2.2 + Math.random() * 1.3;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.04, transparent: true, opacity: 0.72 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let id: number;
    let t = 0;

    function animate() {
      id = requestAnimationFrame(animate);
      if (!reduced) {
        t += 0.004;
        knot.rotation.x = t * 0.32;
        knot.rotation.y = t * 0.48;
        ring.rotation.z  = t * 0.11;
        ring2.rotation.x = t * 0.09;
        particles.rotation.y = t * 0.06;
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(id);
      renderer.dispose();
      [knotGeo, knotMat, ringGeo, ringMat, ring2Geo, ring2Mat, pGeo, pMat].forEach(o => o.dispose());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}
