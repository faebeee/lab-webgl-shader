import * as THREE from 'three';
import Microphone, { updateSensitivity } from '@faebeee/lab-utils/libs/microphone';
import Lab from '@faebeee/lab-utils';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SENSITIVITY = null;
const analyser = Microphone(1024);
const frequencyArray = new Float32Array(analyser.frequencyBinCount);

Lab.init(WIDTH, HEIGHT);
Lab.camera.position.set(32, 10, 100);
Lab.camera.lookAt(32, 0, 32);
createLights();
const object = createObject();
//sphere.position.set(0, 0, 0);
Lab.scene.add(object);

Lab.update = () => {
    analyser.getFloatTimeDomainData(frequencyArray);
    const noise = updateSensitivity(frequencyArray, SENSITIVITY);
    const { geometry } = object;

    for (let i = 0; i < noise.length; i++) {
        geometry.vertices[i].y = noise[i];
    }

    geometry.verticesNeedUpdate = true;
};


function createObject() {
    const geometry = new THREE.Geometry();
    for (let x = 0; x < 32; x++) {
        for (let z = 0; z < 32; z++) {
            geometry.vertices.push(new THREE.Vector3(x * 2, 0, z * 2));
        }
    }
    var material = new THREE.PointsMaterial({ color: 0xffffff });

    return new THREE.Points(geometry, material);
}

function vertexShader() {
    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
  `
}

function createLights() {
    let light = new THREE.PointLight('#fffff0', 1, 150);
    light.castShadow = true;
    light.position.set(-50, 100, 50);
    Lab.scene.add(light);

    let light2 = new THREE.PointLight('#fffff0', 1, 150);
    light2.castShadow = true;
    light2.position.set(50, 100, 50);
    Lab.scene.add(light2);

    let light3 = new THREE.PointLight('#ff0000', 1, 150);
    light3.castShadow = true;
    light3.position.set(0, -50, 50);
    Lab.scene.add(light3);
}


function update() {
    Lab.render();
    requestAnimationFrame(update);
}

update();
