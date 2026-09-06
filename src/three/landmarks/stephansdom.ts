import * as THREE from 'three';

export function createStephansdom(): THREE.Group {
  const g = new THREE.Group();

  // material for chruch
  
  const wall  = new THREE.MeshStandardMaterial({ color: 0xD1C7AC, roughness: 0.8 });
  const trim  = new THREE.MeshStandardMaterial({ color: 0xB1A58C, roughness: 0.85 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x3C434A, roughness: 0.6 });
  const spire = new THREE.MeshStandardMaterial({ color: 0x2E6B56, roughness: 0.5, metalness: 0.2 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.9 });
  const gold  = new THREE.MeshStandardMaterial({ color: 0xC8A96E, roughness: 0.4, metalness: 0.6 });

  
  const box = (w: number, h: number, d: number, mat: THREE.Material) =>
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  const cone = (r: number, h: number, seg: number, mat: THREE.Material) =>
    new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat);


  const add = (mesh: THREE.Mesh, x: number, y: number, z: number) => {
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
  };


  function createTower(
    baseWidth: number,
    baseHeight: number,
    spireHeight: number,
    spireMat: THREE.Material,
    withCross = false
  ) {
    const t = new THREE.Group();
    const addTo = (mesh: THREE.Mesh, x: number, y: number, z: number) => {
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      t.add(mesh);
    };

    addTo(box(baseWidth, baseHeight, baseWidth, wall), 0, baseHeight / 2, 0);
    addTo(box(baseWidth + 0.2, 0.15, baseWidth + 0.2, trim), 0, baseHeight * 0.6, 0);
    addTo(cone(baseWidth * 0.58, spireHeight, 8, spireMat), 0, baseHeight + spireHeight / 2, 0);
    addTo(new THREE.Mesh(new THREE.CylinderGeometry(baseWidth * 0.62, baseWidth * 0.62, 0.18, 8), roofMat), 0, baseHeight + 0.09, 0);

    if (withCross) {
      addTo(box(0.08, 0.7, 0.08, gold), 0, baseHeight + spireHeight + 0.35, 0);
      addTo(box(0.4, 0.08, 0.08, gold), 0, baseHeight + spireHeight + 0.53, 0);
    }
    return t;
  }

  
  const naveWidth = 6, naveHeight = 6, naveDepth = 12;

  add(box(naveWidth, naveHeight, naveDepth, wall), 0, naveHeight / 2, 0);
  add(box(naveWidth + 0.25, 0.18, naveDepth + 0.25, trim), 0, 1.2, 0);              
  add(box(naveWidth + 0.25, 0.18, naveDepth + 0.25, trim), 0, naveHeight * 0.55, 0); 
  add(box(naveWidth + 0.25, 0.18, naveDepth + 0.25, trim), 0, naveHeight + 0.05, 0); 

  const roofHeight = 2.4;
  const naveLength = naveDepth + 0.4;
 
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-naveWidth / 2, 0);
  roofShape.lineTo(naveWidth / 2, 0);
  roofShape.lineTo(0, roofHeight);
  roofShape.closePath();

  const roofGeo = new THREE.ExtrudeGeometry(roofShape, {
    depth: naveLength,
    bevelEnabled: false,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, naveHeight + 0.14, -naveLength / 2);
  roof.castShadow = true;
  roof.receiveShadow = true;
  g.add(roof);

  for (let i = 0; i < 5; i++) {
    const z = -naveDepth / 2 + i * (naveDepth / 4);
    const buttressHeight = naveHeight * 0.88;
    for (const side of [-1, 1]) {
      const x = side * (naveWidth / 2 + 0.22);
      add(box(0.45, buttressHeight, 0.75, trim), x, buttressHeight / 2, z);
      const cap = cone(0.38, 0.55, 4, trim);
      cap.rotation.y = Math.PI / 4;
      add(cap, x, buttressHeight + 0.27, z);
    }
  }

  for (let i = 0; i < 4; i++) {
    const z = -naveDepth / 2 + (naveDepth / 4) / 2 + i * (naveDepth / 4);
    add(box(0.1, 2.0, 0.7, glass), -naveWidth / 2 - 0.02, 3.4, z);
    add(box(0.1, 2.0, 0.7, glass),  naveWidth / 2 + 0.02, 3.4, z);
  }


  add(box(2.2, 3.2, 0.25, trim),   0, 1.6, naveDepth / 2 + 0.05); 
  add(box(1.4, 2.6, 0.35, glass),  0, 1.3, naveDepth / 2 + 0.05);  
  const arch = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 0.25, 12, 1, false, 0, Math.PI),
    trim
  );
  arch.rotation.x = Math.PI / 2;
  arch.castShadow = true;
  arch.receiveShadow = true;
  arch.position.set(0, 3.2, naveDepth / 2 + 0.05);
  g.add(arch);

  
  const roseZ = naveDepth / 2 + 0.06;
  for (const r of [0.65, 0.42, 0.2]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 8, 16), trim);
    ring.position.set(0, 5.0, roseZ);
    ring.castShadow = true;
    g.add(ring);
  }
  const roseFill = new THREE.Mesh(new THREE.CircleGeometry(0.62, 16), glass);
  roseFill.position.set(0, 5.0, roseZ - 0.01);
  g.add(roseFill);

  
  const southTower = createTower(2.2, 13, 8, spire, true);
  southTower.position.set(naveWidth / 2 + 1.1, 0, 1.0);
  g.add(southTower);

   const northTower = createTower(2.0, 8, 2.5, spire);
  northTower.position.set(-naveWidth / 2 - 1.0, 0, 1.0);
  g.add(northTower);

   const frontLeftTower = createTower(1.3, 7, 3.0, spire);
  frontLeftTower.position.set(-naveWidth / 2 + 0.65, 0, naveDepth / 2 - 0.5);
  g.add(frontLeftTower);

  const frontRightTower = createTower(1.3, 7, 3.0, spire);
   frontRightTower.position.set(naveWidth / 2 - 0.65, 0, naveDepth / 2 - 0.5);
    g.add(frontRightTower);

  add(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 5, 10), wall),  0, 2.5, -naveDepth / 2 - 1.5);
  add(new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.2, 10), trim), 0, 5.1, -naveDepth / 2 - 1.5);
  add(cone(2.3, 2.5, 10, spire), 0, 7.0, -naveDepth / 2 - 1.5);

  return g;
}