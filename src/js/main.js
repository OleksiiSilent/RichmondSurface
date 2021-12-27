import * as THREE from "three"
import {ParametricGeometry} from "three/examples/jsm/geometries/ParametricGeometry";
import {AnaglyphEffect} from "three/examples/jsm/effects/AnaglyphEffect";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {DoubleSide} from "three";

let camera, controls, scene, renderer, effect, aspect, mesh;
let radius = 0.6

init();
animate();

function init() {
    aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera( 40, aspect, 0.1, 10000 );
    camera.position.z = 5;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x414141);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.02);

    let kleinSurface = createSurface();
    scene.add(kleinSurface);
    createRender();
    window.addEventListener('resize', onWindowResize, false);

    controls = new TrackballControls(camera, renderer.domElement );
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
}

function createSurface(){
    const geometry = new ParametricGeometry(richmond, 100, 100);
    const material = new THREE.MeshNormalMaterial({ side:DoubleSide });

    mesh = new THREE.Mesh( geometry, material );
    return mesh;
}

function richmond(r, t, target) {
    let rho=(1+3*radius)*r-2-radius;
    const u=Math.exp(rho)*Math.cos(2*Math.PI*t);
    const v=Math.exp(rho)*Math.sin(2*Math.PI*t);

    const x=-u/(u*u+v*v)-u*u*u/3+u*v*v;
    const y=-v/(u*u+v*v)-u*u*v+v*v*v/3;
    const z=2*u;
    target.set(y/4, z/4, -x/4);
}

function createRender(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    effect = new AnaglyphEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function onWindowResize() {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function render(){
    renderer.render(scene,camera);
    effect.render(scene, camera);
}

window.addEventListener('deviceorientation', e => {
    let m2 = getRotationMatrix(e.alpha, e.beta, e.gamma);
    let threejs_matrix4 = new THREE.Matrix4();
    threejs_matrix4.set(
        m2[0], m2[1], m2[2], 0,
        m2[3], m2[4], m2[5], 0,
        m2[6], m2[7], m2[8], 0,
        0, 0, 0, 1
    );
    mesh.rotation.setFromRotationMatrix(threejs_matrix4);

    renderer.render(scene, camera);
});

function getRotationMatrix(alpha, beta, gamma) {
    let degtorad = Math.PI / 180; // Degree-to-Radian conversion
    let _x = beta ? beta * degtorad : 0; // beta value
    let _y = gamma ? gamma * degtorad : 0; // gamma value
    let _z = alpha ? alpha * degtorad : 0; // alpha value

    let cX = Math.cos(_x);
    let cY = Math.cos(_y);
    let cZ = Math.cos(_z);
    let sX = Math.sin(_x);
    let sY = Math.sin(_y);
    let sZ = Math.sin(_z);

// ZXY rotation matrix construction.

    let m11 = cZ * cY - sZ * sX * sY;
    let m12 = -cX * sZ;
    let m13 = cY * sZ * sX + cZ * sY;

    let m21 = cY * sZ + cZ * sX * sY;
    let m22 = cZ * cX;
    let m23 = sZ * sY - cZ * cY * sX;

    let m31 = -cX * sY;
    let m32 = sX;
    let m33 = cX * cY;

    return [m11, m12, m13, m21, m22, m23, m31, m32, m33];
}





