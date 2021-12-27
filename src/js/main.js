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