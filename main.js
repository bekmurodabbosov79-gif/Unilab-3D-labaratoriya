import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

function createCore(container, compact = false) {
  if (!container) return;
  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, compact ? 5.2 : 6.1);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth || 300, container.clientHeight || 250);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x91aaff, 1.6));
  const cyanLight = new THREE.PointLight(0x25e7ff, 30, 20);
  cyanLight.position.set(3, 2, 4); scene.add(cyanLight);
  const purpleLight = new THREE.PointLight(0xa855ff, 28, 20);
  purpleLight.position.set(-3, -1, 2); scene.add(purpleLight);

  const group = new THREE.Group(); scene.add(group);
  const geometry = new THREE.IcosahedronGeometry(compact ? 1.0 : 1.28, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x171b3c, metalness: 0.78, roughness: 0.22,
    emissive: 0x3220a0, emissiveIntensity: 0.65, flatShading: true
  });
  const core = new THREE.Mesh(geometry, material); group.add(core);
  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x36eaff, wireframe: true, transparent: true, opacity: 0.75
  }));
  wire.scale.setScalar(1.012); group.add(wire);

  const ringMat = new THREE.MeshBasicMaterial({color:0xa96bff, side:THREE.DoubleSide, transparent:true, opacity:.82});
  const ring = new THREE.Mesh(new THREE.TorusGeometry(compact ? 1.38 : 1.72, .012, 8, 120), ringMat);
  ring.rotation.x = 1.12; ring.rotation.y = .25; group.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(compact ? 1.55 : 1.9, .008, 8, 120),
    new THREE.MeshBasicMaterial({color:0x27e7ff, transparent:true, opacity:.55}));
  ring2.rotation.x = .3; ring2.rotation.y = 1.15; group.add(ring2);

  const stars = new THREE.BufferGeometry();
  const points = [];
  for (let i=0;i<220;i++) points.push((Math.random()-.5)*8,(Math.random()-.5)*5,(Math.random()-.5)*4-1);
  stars.setAttribute('position', new THREE.Float32BufferAttribute(points,3));
  scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0x7284d9,size:.018,transparent:true,opacity:.8})));

  let dragging=false, prevX=0, prevY=0;
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;prevX=e.clientX;prevY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;group.rotation.y+=(e.clientX-prevX)*.009;group.rotation.x+=(e.clientY-prevY)*.009;prevX=e.clientX;prevY=e.clientY});
  renderer.domElement.addEventListener('pointerup',()=>dragging=false);
  renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
  renderer.domElement.addEventListener('wheel',e=>{camera.position.z=Math.max(3.2,Math.min(8,camera.position.z+e.deltaY*.005))},{passive:true});

  function resize(){const w=container.clientWidth||300,h=container.clientHeight||250;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
  const observer = new ResizeObserver(resize); observer.observe(container);
  function animate(){requestAnimationFrame(animate);if(!dragging){group.rotation.y+=.0035;group.rotation.x+=.0012;}ring.rotation.z+=.002;ring2.rotation.z-=.0015;renderer.render(scene,camera);}
  animate();
}
createCore(document.getElementById('hero3d'));
createCore(document.getElementById('modelPreview'), true);
