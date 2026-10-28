import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const host = document.getElementById('lab3d');
const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
camera.position.set(0, 4.6, 9.5);
camera.lookAt(0, .35, 0);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.setSize(host.clientWidth,host.clientHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);
scene.add(new THREE.AmbientLight(0xa9c5ff,1.8));
const key=new THREE.PointLight(0x2deaff,55,20);key.position.set(0,5,4);scene.add(key);
const purple=new THREE.PointLight(0x9c4dff,35,18);purple.position.set(-4,2,-2);scene.add(purple);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,14),new THREE.MeshStandardMaterial({color:0x10182b,metalness:.3,roughness:.75}));
floor.rotation.x=-Math.PI/2;floor.position.y=-.16;scene.add(floor);
const grid=new THREE.GridHelper(16,32,0x2c9cbd,0x26304b);grid.position.y=-.145;scene.add(grid);

function box(w,h,d,color,x,y,z,metal=.5,rough=.35){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough}));
 m.position.set(x,y,z);scene.add(m);return m;
}
function cylinder(r1,r2,h,color,x,y,z){
 const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,32),new THREE.MeshStandardMaterial({color,metalness:.6,roughness:.3,emissive:color,emissiveIntensity:.08}));
 m.position.set(x,y,z);scene.add(m);return m;
}
function wire(points,color){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 const obj=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.035,8,false),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.42,metalness:.35,roughness:.25}));
 scene.add(obj);return obj;
}
// Power supply body and digital screen
box(1.75,.82,1.12,0x202b3d,-3.15,.35,0);
box(1.25,.38,.035,0x06101c,-3.15,.58,.58,0.1,.2);
const screenText = box(.82,.055,.018,0x30e9ff,-3.15,.65,.61,0,0.2);
cylinder(.17,.17,.08,0x9aa9c6,-3.15,.18,.62);
cylinder(.12,.12,.08,0x202b3d,-3.15,.18,.68);
for(let i=0;i<2;i++) cylinder(.07,.07,.09,i===0?0xff426f:0x30eaff,-3.55+i*.8,.03,.6);
// Breadboard
box(2.5,.16,1.25,0xc4d0df,0,.02,0,.1,.65);
box(2.32,.04,1.08,0x202b3d,0,.115,0,.2,.55);
for(let row=0;row<5;row++) for(let col=0;col<19;col++){
 const hole=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.012,8),new THREE.MeshStandardMaterial({color:0x5a6a80,metalness:.1,roughness:.7}));
 hole.rotation.x=Math.PI/2;hole.position.set(-1.05+col*.117,.145,-.42+row*.2);scene.add(hole);
}
// Resistor and LED
const resistor=box(.48,.12,.16,0xcca66d,-.2,.29,0,.45,.28);
for(let i=0;i<3;i++) box(.035,.124,.165,[0x8e4a27,0x202020,0xd8b14b][i],-.31+i*.11,.292,0,.1,.4);
wire([[-3.55,.04,.6],[-2.65,.18,.6],[-2.1,.2,.3],[-1.35,.2,.3],[-.55,.2,.3]],0xff426f);
wire([[.05,.22,.3],[.55,.22,.3],[1.1,.2,.3],[1.65,.2,.3],[2.1,.2,.3],[2.5,.05,.6],[ -2.35,.05,.6]],0x31e6ff);
const led = new THREE.Group();scene.add(led);
cylinder(.11,.13,.18,0xe83d69,1.05,.27,0);
const bulb=new THREE.Mesh(new THREE.SphereGeometry(.15,24,18),new THREE.MeshStandardMaterial({color:0xff355f,emissive:0xff174f,emissiveIntensity:1.6,roughness:.18}));
bulb.position.set(1.05,.43,0);led.add(bulb);
const ledLight=new THREE.PointLight(0xff2357,2,2.4);ledLight.position.set(1.05,.5,0);scene.add(ledLight);
// Meter
box(.95,.58,.55,0x252b3b,2.8,.29,.15);
box(.6,.2,.035,0x07131c,2.8,.43,.44,.1,.2);
const dial=cylinder(.14,.14,.08,0x4d5d78,2.8,.13,.48);dial.rotation.x=Math.PI/2;
for(let i=0;i<2;i++) cylinder(.055,.055,.08,i===0?0xff426f:0x10141f,2.55+i*.5,.02,.48);
wire([[2.55,.02,.48],[2.15,.16,.65],[1.55,.2,.35],[1.15,.2,.1]],0xff426f);
wire([[3.05,.02,.48],[3.2,.05,.8],[3.4,.08,.8],[3.4,.05,-.4],[ -3.6,.05,-.4],[-3.55,.05,.6]],0x31e6ff);

let targetX=0,targetY=0,drag=false,lastX=0,lastY=0;
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;targetY+=(e.clientX-lastX)*.008;targetX+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY});
renderer.domElement.addEventListener('pointerup',()=>drag=false);
renderer.domElement.addEventListener('pointercancel',()=>drag=false);
renderer.domElement.addEventListener('wheel',e=>{camera.position.z=Math.max(6,Math.min(14,camera.position.z+e.deltaY*.008));camera.lookAt(0,.3,0)},{passive:true});
const resize=new ResizeObserver(()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)});resize.observe(host);
function animate(){requestAnimationFrame(animate);scene.rotation.y+=(targetY-scene.rotation.y)*.06;scene.rotation.x+=(targetX-scene.rotation.x)*.06;renderer.render(scene,camera)}animate();

const voltage=document.getElementById('voltage'), resistance=document.getElementById('resistance');
function update(){
 const u=Number(voltage.value),r=Number(resistance.value),i=u/r;
 document.getElementById('voltageValue').textContent=u.toFixed(1);
 document.getElementById('resistanceValue').textContent=r.toFixed(0);
 document.getElementById('outVoltage').textContent=u.toFixed(2)+' V';
 document.getElementById('outCurrent').textContent=i.toFixed(3)+' A';
 document.getElementById('outResistance').textContent=r.toFixed(2)+' Ω';
 document.getElementById('formulaCalc').textContent=`${u.toFixed(1)} / ${r.toFixed(0)} = ${i.toFixed(3)} A`;
 const glow=Math.min(2.4, .1+i*.28);
 bulb.material.emissiveIntensity=glow;
 ledLight.intensity=Math.min(8,.2+i*1.5);
}
voltage.addEventListener('input',update);resistance.addEventListener('input',update);
document.getElementById('runExperiment').addEventListener('click',()=>{update();const b=document.getElementById('runExperiment');b.textContent='✓ Hisoblandi';setTimeout(()=>b.textContent='▶ Tajribani hisoblash',1200)});
update();
