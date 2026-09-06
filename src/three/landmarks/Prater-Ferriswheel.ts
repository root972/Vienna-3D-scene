import * as THREE from 'three';

export function createPraterFerrisWheel(): THREE.Group {
  const group = new THREE.Group();
  const wheelStructure = new THREE.Group();

  // materials selection
  const metal = new THREE.MeshStandardMaterial({ color: 0xC0392B, roughness: 0.5, metalness: 0.7 }); 
  const cable = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.5 });
  const cabin = new THREE.MeshStandardMaterial({ color: 0xE8D5A3, roughness: 0.7 }); 

  const add = (mesh: THREE.Mesh, x: number, y: number, z: number) => {
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  const addToWheel = (mesh: THREE.Mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wheelStructure.add(mesh);
  };

  // dimensins  for the wheel
  const wheelRadius = 8;
  const numSpokes = 16;
  const numCabins = 16;

  // outer rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(wheelRadius, 0.18, 8, 64), metal);
  addToWheel(rim);

  
  const innerRim = new THREE.Mesh(new THREE.TorusGeometry(wheelRadius * 0.75, 0.1, 8, 64), metal);
  addToWheel(innerRim);

  
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.6, 16), metal);
  hub.position.set(0, 0, 0);
  addToWheel(hub);

  
  for (let i = 0; i < numSpokes; i++) {
    const angle = (i / numSpokes) * Math.PI * 2;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, wheelRadius, 6),
      cable
    );
    
    spoke.rotation.z = angle + Math.PI / 2;
    spoke.position.set(
      Math.cos(angle) * (wheelRadius / 2),
      Math.sin(angle) * (wheelRadius / 2),
      0
    );
    addToWheel(spoke);

    
    if (i % 2 === 0) {
      const outerSpoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, wheelRadius * 0.25, 6),
        cable
      );
      const midR = wheelRadius * 0.875;
      outerSpoke.rotation.z = angle + Math.PI / 2;
      outerSpoke.position.set(Math.cos(angle) * midR, Math.sin(angle) * midR, 0);
      addToWheel(outerSpoke);
    }
  }

  // cabins for the wheel 
  for (let i = 0; i < numCabins; i++) {
    const angle = (i / numCabins) * Math.PI * 2;
    const cabinMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.5), cabin);
    cabinMesh.position.set(
      Math.cos(angle) * wheelRadius,
      Math.sin(angle) * wheelRadius,
      0
    );
    addToWheel(cabinMesh);
  }

  group.add(wheelStructure);


  const legHeight = wheelRadius + 1.5;
  const legSpread = 4.5;

  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, legHeight, 8), metal);
    leg.position.set(side * legSpread, -legHeight / 2 - wheelRadius + 1.5, 0);
    leg.rotation.z = side * 0.22; 
    leg.castShadow = true;
    group.add(leg);
  }

  
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, legSpread * 2, 6), metal),
    0, -wheelRadius + 0.2, 0
  );

  
  add(new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 2), metal), 0, -wheelRadius - 0.6, 0);

  
  group.position.y = wheelRadius + legHeight / 2 - 1.3;

  return group;
}

export function updatePraterFerrisWheel(wheel: THREE.Group, elapsedTime: number) {
  const wheelStructure = wheel.children.find(
    (child) => child instanceof THREE.Group
  )

  if (!wheelStructure) return
  wheelStructure.rotation.z = elapsedTime * 0.12;
}