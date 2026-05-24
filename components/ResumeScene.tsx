'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ResumeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = 340, H = 340;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.5;

    // Outer wireframe icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outer);

    // Inner icosahedron (counter-rotates)
    const innerGeo = new THREE.IcosahedronGeometry(0.95, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(2.55, 0.007, 6, 90);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.22,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    scene.add(ring);

    // Second ring, different inclination
    const ring2Geo = new THREE.TorusGeometry(2.3, 0.005, 6, 90);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    // Floating particles (shell distribution)
    const pGeo = new THREE.BufferGeometry();
    const pPos: number[] = [];
    for (let i = 0; i < 70; i++) {
      const r = 2.3 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pPos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.038,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId: number;
    let t = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!prefersReduced) {
        t += 0.004;
        outer.rotation.x = t * 0.28;
        outer.rotation.y = t * 0.46;
        inner.rotation.x = -t * 0.38;
        inner.rotation.y =  t * 0.6;
        ring.rotation.z  =  t * 0.14;
        ring2.rotation.z = -t * 0.09;
        particles.rotation.y = t * 0.07;
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      [outerGeo, outerMat, innerGeo, innerMat,
       ringGeo, ringMat, ring2Geo, ring2Mat, pGeo, pMat].forEach(o => o.dispose());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}
