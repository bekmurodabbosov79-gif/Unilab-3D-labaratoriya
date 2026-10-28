
// UniLab 3D - LED Volt-Amper xarakteristikasi (Tuzatilgan yorug'lik va ko'rinish)

window.addEventListener('DOMContentLoaded', () => {
// DOM Elementlari
const voltInput = document.getElementById('volt');
const vOutSpan = document.getElementById('vOut');
const resSelect = document.getElementById('res');
const dioSelect = document.getElementById('dio');
const bAdd = document.getElementById('bAdd');
const bScan = document.getElementById('bScan');
const bClr = document.getElementById('bClr');
const bCsv = document.getElementById('bCsv');
const bConcl = document.getElementById('bConcl');
const bCopy = document.getElementById('bCopy');
const csvBox = document.getElementById('csvbox');
const csvTa = document.getElementById('csvta');
const conclDiv = document.getElementById('concl');
const tableBody = document.getElementById('tb');

const iV = document.getElementById('iV');
const iA = document.getElementById('iA');
const iB = document.getElementById('iB');
const iR = document.getElementById('iR');
const iD = document.getElementById('iD');
const iS = document.getElementById('iS');
const ledName = document.getElementById('ledName');
const ledVf = document.getElementById('ledVf');
const brBar = document.getElementById('brBar');
const brTxt = document.getElementById('brTxt');

const diodes = {
red: { name: 'Qizil LED', vf: 1.8, color: 0xff3b4e, hex: '#ff3b4e' },
green: { name: 'Yashil LED', vf: 2.1, color: 0x12b36f, hex: '#12b36f' },
blue: { name: 'Koʻk LED', vf: 3.0, color: 0x38b6ff, hex: '#38b6ff' },
white: { name: 'Oq LED', vf: 3.1, color: 0xffffff, hex: '#ffffff' },
si: { name: 'Kremniy diod', vf: 0.7, color: 0xffc857, hex: '#ffc857' }
};

let measurements = [];

const container = document.getElementById('view');
const canvas = document.getElementById('c3');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06101f);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 3.5, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// YORUG'LIKNI TO'G'RILASH (Haddan tashqari oq bo'lib ketishining oldini olish uchun pasaytirildi)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 8, 5);
scene.add(dirLight);

const circuitGroup = new THREE.Group();
scene.add(circuitGroup);

// Stol asosi (to'qroq rangda)
const tableGeo = new THREE.BoxGeometry(8, 0.1, 6);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x0b1b33, roughness: 0.7 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -0.15;
circuitGroup.add(table);

// 1. Tok manbai bloki (Lab Power Supply) - Chiroyli kulrang tusda
const psuGeo = new THREE.BoxGeometry(1.5, 1.0, 1.2);
const psuMat = new THREE.MeshStandardMaterial({ color: 0x3a4a5b, roughness: 0.4 });
const psu = new THREE.Mesh(psuGeo, psuMat);
psu.position.set(-1.6, 0.4, 0);
circuitGroup.add(psu);

// PSU old paneli (qora ekran qismi)
const panelGeo = new THREE.BoxGeometry(0.05, 0.7, 0.9);
const panelMat = new THREE.MeshStandardMaterial({ color: 0x11161d });
const panel = new THREE.Mesh(panelGeo, panelMat);
panel.position.set(-0.82, 0.4, 0);
circuitGroup.add(panel);

// PSU regulyator tugmasi
const knobGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 32);
const knobMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
const knob = new THREE.Mesh(knobGeo, knobMat);
knob.rotation.z = Math.PI / 2;
knob.position.set(-0.78, 0.25, 0.3);
circuitGroup.add(knob);

// Klemma terminallar
const termGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.12);
const redTermMat = new THREE.MeshStandardMaterial({ color: 0xff3b4e });
const blackTermMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

const redTerm = new THREE.Mesh(termGeo, redTermMat);
redTerm.rotation.x = Math.PI / 2;
redTerm.position.set(-0.8, 0.15, -0.25);
circuitGroup.add(redTerm);

const blackTerm = new THREE.Mesh(termGeo, blackTermMat);
blackTerm.rotation.x = Math.PI / 2;
blackTerm.position.set(-0.8, 0.15, -0.45);
circuitGroup.add(blackTerm);

// 2. Non-stop plata (Breadboard)
const boardGeo = new THREE.BoxGeometry(2.4, 0.12, 1.6);
const boardMat = new THREE.MeshStandardMaterial({ color: 0xe5ecf4, roughness: 0.4 });
const board = new THREE.Mesh(boardGeo, boardMat);
board.position.set(0.6, 0.04, 0);
circuitGroup.add(board);

// 3. Rezistor
const resGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
const resMat = new THREE.MeshStandardMaterial({ color: 0xd9b382 });
const resistor3d = new THREE.Mesh(resGeo, resMat);
resistor3d.rotation.z = Math.PI / 2;
resistor3d.position.set(0.3, 0.15, 0);
circuitGroup.add(resistor3d);

// 4. LED 3D modeli
const ledGroup = new THREE.Group();
const bulbGeo = new THREE.SphereGeometry(0.18, 32, 32);
const bulbMat = new THREE.MeshStandardMaterial({ 
color: 0xff3b4e, 
emissive: 0xff3b4e, 
emissiveIntensity: 0.5,
transparent: true,
opacity: 0.9 
});
const bulb = new THREE.Mesh(bulbGeo, bulbMat);
bulb.position.set(1.2, 0.3, 0);
ledGroup.add(bulb);

const pinGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.25);
const pinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
const pin1 = new THREE.Mesh(pinGeo, pinMat);
pin1.position.set(1.12, 0.12, 0);
const pin2 = new THREE.Mesh(pinGeo, pinMat);
pin2.position.set(1.28, 0.12, 0);
ledGroup.add(pin1);
ledGroup.add(pin2);
circuitGroup.add(ledGroup);

// 5. Simlarni chizish
function createWire(x1, z1, x2, z2, colorHex) {
const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
const wireGeo = new THREE.CylinderGeometry(0.018, 0.018, distance, 8);
const wireMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });
const wire = new THREE.Mesh(wireGeo, wireMat);

wire.position.set((x1 + x2) / 2, 0.08, (z1 + z2) / 2);
wire.rotation.x = Math.PI / 2;
wire.rotation.z = Math.atan2(x2 - x1, z2 - z1);
circuitGroup.add(wire);
}

createWire(-0.8, -0.25, 0.05, 0, 0xff3b4e); // Qizil sim
createWire(-0.8, -0.45, 1.28, 0, 0x111111); // Qora sim

// Sichqoncha yordamida sahnani aylantirish
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
isDragging = true;
previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
if (!isDragging) return;
const deltaX = e.clientX - previousMousePosition.x;
const deltaY = e.clientY - previousMousePosition.y;

circuitGroup.rotation.y += deltaX * 0.01;
circuitGroup.rotation.x += deltaY * 0.01;

previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
isDragging = false;
});

function updateSimulation() {
const vIn = parseFloat(voltInput.value);
const rVal = parseFloat(resSelect.value);
const dioKey = dioSelect.value;
const currentDio = diodes[dioKey];

vOutSpan.textContent = vIn.toFixed(1);
iR.textContent = rVal + ' Ω';
iD.textContent = currentDio.name;

let vDiod = 0;
let iCurrent = 0; 
let brightness = 0;


if (vIn >= currentDio.vf) {
vDiod = currentDio.vf;
iCurrent = ((vIn - vDiod) / rVal) * 1000;
brightness = Math.min(100, Math.round((iCurrent / 20) * 100));
iS.textContent = 'Oldinga ulanish';
iS.style.color = '#12b36f';
} else {
vDiod = vIn;
iCurrent = 0;
brightness = 0;
iS.textContent = 'Yopiq (Tok yoʻq)';
iS.style.color = '#ff3b4e';
}

iV.textContent = vDiod.toFixed(2) + ' V';
iA.textContent = iCurrent.toFixed(1) + ' mA';
iB.textContent = brightness + '%';

ledName.textContent = currentDio.name;
ledVf.textContent = 'Uf ≈ ' + currentDio.vf + ' V';
brBar.style.width = brightness + '%';
brBar.style.background = currentDio.hex;
brTxt.textContent = brightness + '%';

bulbMat.color.setHex(currentDio.color);
bulbMat.emissive.setHex(currentDio.color);
bulbMat.emissiveIntensity = brightness > 0 ? (brightness / 25) : 0.05;

return { v: vDiod, a: iCurrent };
}

const chartCanvas = document.getElementById('ch');
const ctx = chartCanvas.getContext('2d');

function drawChart() {
ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

ctx.strokeStyle = '#17406e';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(50, 20);
ctx.lineTo(50, 260);
ctx.lineTo(580, 260);
ctx.stroke();

ctx.fillStyle = '#7fb0e8';
ctx.font = '12px sans-serif';
ctx.fillText('Tok (mA)', 10, 30);
ctx.fillText('Kuchlanish (V)', 530, 285);

if (measurements.length === 0) return;

ctx.strokeStyle = '#38b6ff';
ctx.lineWidth = 2;
ctx.beginPath();

measurements.forEach((pt, index) => {
let x = 50 + (pt.v / 5) * 500;
let y = 260 - (pt.a / 30) * 240;

if (index === 0) ctx.moveTo(x, y);
else ctx.lineTo(x, y);

ctx.fillStyle = '#ff3b4e';
ctx.fillRect(x - 3, y - 3, 6, 6);
});
ctx.stroke();
}

function updateTable() {
tableBody.innerHTML = '';
measurements.forEach((m, idx) => {
const tr = document.createElement('tr');
tr.innerHTML = '<td>' + (idx + 1) + '</td><td>' + m.v.toFixed(2) + '</td><td>' + m.a.toFixed(1) + '</td>';
tableBody.appendChild(tr);
});
drawChart();
}

voltInput.addEventListener('input', updateSimulation);
resSelect.addEventListener('change', updateSimulation);
dioSelect.addEventListener('change', updateSimulation);

bAdd.addEventListener('click', () => {
const currentData = updateSimulation();
measurements.push(currentData);
updateTable();
});

bClr.addEventListener('click', () => {
measurements = [];
updateTable();
csvBox.style.display = 'none';
conclDiv.style.display = 'none';
});

bScan.addEventListener('click', () => {
measurements = [];
const currentDio = diodes[dioSelect.value];
const rVal = parseFloat(resSelect.value);

for (let v = 0; v <= 5; v += 0.2) {
let vDiod = v >= currentDio.vf ? currentDio.vf : v;
let iCurrent = v >= currentDio.vf ? ((v - vDiod) / rVal) * 1000 : 0;
measurements.push({ v: vDiod, a: iCurrent });
}
updateTable();
});

bCsv.addEventListener('click', () => {
let csv = '№,Kuchlanish(V),Tok(mA)\n';
measurements.forEach((m, i) => {
csv += (i + 1) + ',' + m.v.toFixed(2) + ',' + m.a.toFixed(1) + '\n';
});
csvTa.value = csv;
csvBox.style.display = 'block';
});

bCopy.addEventListener('click', () => {
csvTa.select();
document.execCommand('copy');
alert('Nusxalandi!');
});


bConcl.addEventListener('click', () => {
conclDiv.style.display = 'block';
conclDiv.innerHTML = '<b>Xulosa:</b> Tok manbai va laboratoriya stoli orqali LED diodining volt-amper xarakteristikasi olindi.';
});

updateSimulation();

// Yorliqlar uchun DOM elementlari
    const tagPsu = document.getElementById('tag-psu');
    const tagRes = document.getElementById('tag-res');
    const tagLed = document.getElementById('tag-led');

    function updateLabels() {
        // Har bir obyektning 3D fazodagi markaziy nuqtalari
        const psuPos = new THREE.Vector3(-1.7, 0.8, 0);
        const resPos = new THREE.Vector3(0.2, 0.4, 0);
        const ledPos = new THREE.Vector3(1.1, 0.6, 0);

        // Obyektlarni guruh aylanishiga moslash uchun matrisani qo'llaymiz
        psuPos.applyMatrix4(circuitGroup.matrixWorld);
        resPos.applyMatrix4(circuitGroup.matrixWorld);
        ledPos.applyMatrix4(circuitGroup.matrixWorld);

        function setLabelPosition(vector, element) {
            vector.project(camera);
            // Agar obyekt kamera orqasida qolsa, yorliqni yashiramiz
            if (vector.z > 1) {
                element.style.display = 'none';
                return;
            }
            const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const y = (-(vector.y * 0.5) + 0.5) * container.clientHeight;
            
            element.style.display = 'block';
            element.style.left = x + 'px';
            element.style.top = (y - 10) + 'px';
        }

        setLabelPosition(psuPos, tagPsu);
        setLabelPosition(resPos, tagRes);
        setLabelPosition(ledPos, tagLed);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        updateLabels(); // Har bir kadrda yorliqlarni yangilash
    }
    animate();
// Sichqoncha g'ildiragi yordamida yaqinlashtirish va uzoqlashtirish (Zoom)
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        // Kameraning uzoqligini o'zgartirish
        camera.position.z += e.deltaY * 0.005;
        
        // Juda yaqin yoki juda uzoqqa ketib qolishini cheklash
        camera.position.z = Math.max(3, Math.min(10, camera.position.z));
    }, { passive: false });
window.addEventListener('resize', () => {
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(container.clientWidth, container.clientHeight);
});
});
