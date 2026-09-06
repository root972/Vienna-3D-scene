import * as THREE from 'three';

export function createParliament(): THREE.Group {
  const parliamentGroup = new THREE.Group();

  // Materials 
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xEAE3D2, 
    roughness: 0.7,
    metalness: 0.1,
  });
//roof and its color
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x5C6360, 
    roughness: 0.6,
  });
// the gold color for the cones 
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xD4AF37, 
    roughness: 0.3,
    metalness: 0.8,
  });
           //fountain infront of parliment
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x1B6CA8, 
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.8,
  });
//flagpole color it silver
  const poleMat = new THREE.MeshStandardMaterial({
    color: 0xD0D0D0, 
    roughness: 0.3,
    metalness: 0.8,
  });
           // creatng austrian flags on parliment 
  const createAustrianFlagMaterials = () => [
    new THREE.MeshBasicMaterial({ color: 0xFF2A1B, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: 0xFF2A1B, side: THREE.DoubleSide }),
  ];

  
  const createColumnRow = (count: number, spacing: number, height: number, radius: number): THREE.Group => {
    const row = new THREE.Group();
    const colGeo = new THREE.CylinderGeometry(radius, radius * 1.1, height, 12);
    const startX = -((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
      const col = new THREE.Mesh(colGeo, stoneMat);
      col.position.set(startX + i * spacing, height / 2, 0);
      col.castShadow = true;
      row.add(col);
    }
    return row;
  };


  const createWavingFlag = (
    material: THREE.Material | THREE.Material[],
    poleHeight = 4.5
  ): THREE.Group => {
    const flagGroup = new THREE.Group();

    // Flagpole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, poleHeight, 8), poleMat);
    pole.position.y = poleHeight / 2;
    pole.castShadow = true;
    flagGroup.add(pole);

    const stripeMaterials = Array.isArray(material) ? material : [material];
    const stripeHeight = stripeMaterials.length === 3 ? 0.8 / 3 : 0.8;

    stripeMaterials.forEach((stripeMaterial, index) => {
      const stripeGeometry = new THREE.PlaneGeometry(1.2, stripeHeight, 8, 2);
      
      const flagPlane = new THREE.Mesh(stripeGeometry.clone(), stripeMaterial);
      flagPlane.userData.isFlag = true;
      flagPlane.position.set(
        0.6,
        poleHeight - 0.5 + (stripeMaterials.length === 3 ? (1 - index) * stripeHeight : 0),
        0
      );
      flagPlane.castShadow = true;

      const pos = flagPlane.geometry.attributes.position;
      for (let vertex = 0; vertex < pos.count; vertex++) {
        pos.setZ(vertex, Math.sin(pos.getX(vertex) * 4) * 0.08);
      }
      flagPlane.geometry.computeVertexNormals();
      flagGroup.add(flagPlane);
    });

    return flagGroup;
  };


  const baseGeo = new THREE.BoxGeometry(22, 1.2, 12);
  const base = new THREE.Mesh(baseGeo, stoneMat);
  base.position.y = 0.6;
  base.receiveShadow = true;
  parliamentGroup.add(base);

  // Ramp Stairs
  const stepsGeo = new THREE.BoxGeometry(10, 0.6, 3);
  const steps = new THREE.Mesh(stepsGeo, stoneMat);
  steps.position.set(0, 0.3, 6.5);
  steps.receiveShadow = true;
  parliamentGroup.add(steps);

  const porticoGroup = new THREE.Group();
  porticoGroup.position.set(0, 1.2, 4);

  // the roman columns struc fur parliment
  const columns = createColumnRow(8, 0.9, 4.5, 0.22);
  porticoGroup.add(columns);

  
  const entablature = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.5, 1.2), stoneMat);
  entablature.position.set(0, 4.75, 0);
  entablature.castShadow = true;
  porticoGroup.add(entablature);


  const pedimentGeo = new THREE.CylinderGeometry(4.2, 4.2, 1.2, 3);
  const pediment = new THREE.Mesh(pedimentGeo, stoneMat);
  pediment.rotation.z = Math.PI / 2;
  pediment.scale.set(0.3, 1, 0.4);
  pediment.position.set(0, 5.5, 0);
  pediment.castShadow = true;
  porticoGroup.add(pediment);


  const statue = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.0, 6), goldMat);
  statue.position.set(0, 6.5, 0);
  porticoGroup.add(statue);

  // central flag 
  const centerFlag = createWavingFlag(createAustrianFlagMaterials(), 3.5);
  centerFlag.position.set(0, 6.5, 0);
  porticoGroup.add(centerFlag);

  parliamentGroup.add(porticoGroup);

  
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 8), stoneMat);
  mainBlock.position.set(0, 3.95, 0);
  mainBlock.castShadow = true;
  mainBlock.receiveShadow = true;
  parliamentGroup.add(mainBlock);

  // roof
  const centralRoof = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.4, 8.4), roofMat);
  centralRoof.position.set(0, 6.9, 0);
  parliamentGroup.add(centralRoof);

  
  for (const side of [-1, 1]) {
    const wingGroup = new THREE.Group();
    const wingX = side * 8.5;

    const wingBlock = new THREE.Mesh(new THREE.BoxGeometry(5, 4.2, 9), stoneMat);
    wingBlock.position.set(wingX, 3.3, 0.5);
    wingBlock.castShadow = true;
    wingGroup.add(wingBlock);

    const wingCols = createColumnRow(4, 0.9, 3.2, 0.18);
    wingCols.position.set(wingX, 1.2, 5.1);
    wingGroup.add(wingCols);

    const wingRoof = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.3, 9.4), roofMat);
    wingRoof.position.set(wingX, 5.55, 0.5);
    wingGroup.add(wingRoof);

    parliamentGroup.add(wingGroup);
  }
// statues neside the parliment 
  for (const side of [-1, 1]) {
    const statueGroup = new THREE.Group();
    const statueX = side * 5.8;
    const statueZ = 7.0;

    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.4), stoneMat);
    pedestal.position.set(statueX, 1.2, statueZ);
    pedestal.castShadow = true;
    statueGroup.add(pedestal);

    const addStatuePart = (geometry: THREE.BufferGeometry, position: [number, number, number], rotationZ = 0) => {
      const part = new THREE.Mesh(geometry, stoneMat);
      part.position.set(...position);
      part.rotation.z = rotationZ;
      part.castShadow = true;
      statueGroup.add(part);
    };
// statues body parts 
    addStatuePart(new THREE.BoxGeometry(0.42, 0.3, 0.34), [statueX, 2.95, statueZ]);
    addStatuePart(new THREE.BoxGeometry(0.68, 0.78, 0.42), [statueX, 3.42, statueZ]);
    addStatuePart(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 6), [statueX, 3.92, statueZ]);
    addStatuePart(new THREE.SphereGeometry(0.23, 8, 6), [statueX, 4.2, statueZ]);

  
    for (const limbSide of [-1, 1]) {
      addStatuePart(
        new THREE.BoxGeometry(0.18, 0.58, 0.2),
        [statueX + limbSide * 0.43, 3.48, statueZ],
        limbSide * 0.35
      );
      addStatuePart(
        new THREE.BoxGeometry(0.16, 0.48, 0.18),
        [statueX + limbSide * 0.68, 3.14, statueZ + 0.02],
        limbSide * -0.8
      );
      addStatuePart(
        new THREE.BoxGeometry(0.22, 0.52, 0.24),
        [statueX + limbSide * 0.2, 2.62, statueZ + 0.03],
        limbSide * -0.18
      );
      addStatuePart(
        new THREE.BoxGeometry(0.2, 0.5, 0.22),
        [statueX + limbSide * 0.4, 2.2, statueZ + 0.08],
        limbSide * 0.08
      );
    }

    
    addStatuePart(new THREE.BoxGeometry(0.82, 1.05, 0.1), [statueX, 3.2, statueZ - 0.25]);

    parliamentGroup.add(statueGroup);
  }

  //  fountain 
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0, 9.5);

  const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.4, 16), stoneMat);
  basin.position.y = 0.2;
  fountainGroup.add(basin);

  const water = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.1, 16), waterMat);
  water.position.y = 0.38;
  fountainGroup.add(water);

  const fountainPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.8, 8), stoneMat);
  fountainPillar.position.y = 1.1;
  fountainGroup.add(fountainPillar);

  const atheneStatue = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 6), goldMat);
  atheneStatue.position.y = 2.4;
  atheneStatue.castShadow = true;
  fountainGroup.add(atheneStatue);

  parliamentGroup.add(fountainGroup);

  // left and righ flags 
  const frontFlags = [
    { x: -3.2, z: 9.8, mat: createAustrianFlagMaterials() },
    { x: 3.2, z: 9.8, mat: createAustrianFlagMaterials() }
  ];

  frontFlags.forEach(({ x, z, mat }) => {
    const flag = createWavingFlag(mat, 4.5);
    flag.position.set(x, 0, z);
    parliamentGroup.add(flag);
  });

  return parliamentGroup;
}