import * as THREE from "three"
import {ParametricGeometry} from "three/examples/jsm/geometries/ParametricGeometry";
import {AnaglyphEffect} from "three/examples/jsm/effects/AnaglyphEffect";


let effect;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let radius = 0.5
let mesh;

document.addEventListener( 'mousemove', onDocumentMouseMove );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.01, 1000 );


scene.add(camera);
let kleinSurface = createSurface();
scene.add(kleinSurface);

camera.position.z = 5;
const renderer = createRender();

function createRender(){
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    effect = new AnaglyphEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    return renderer;
}

function createSurface(){
    const geometry = new ParametricGeometry(richmond, 50, 50);
    const material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    return mesh;
}
/*
function klein ( v, u, target ) {

    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;
    let x, z;

    if (u < Math.PI) {

        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);

    } else {

        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);

    }

    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    target.set(x, y, z);
}

function virichCyclicSurfaceParameterizedVector(t, v, target) {
    var a = 1.5;
    var b = 3;
    var c = 2;
    var d = 4;

    t = t * Math.PI * 2;
    v = v * Math.PI * 2;

    var f = (a * b) / Math.sqrt((a * a * Math.sin(v) * Math.sin(v)) + b * b * Math.cos(v) * Math.cos(v));

    var x = ((f * (1 + Math.cos(t))) + ((d * d - c * c) * (1 - Math.cos(t)) / f)) * Math.cos(v) / 2;
    var y = ((f * (1 + Math.cos(t))) + ((d * d - c * c) * (1 - Math.cos(t)) / f)) * Math.sin(v) / 2;
    var z = (f - (d * d - c * c) / f) * Math.sin(t) / 2;

    const scale = 1;
    target.set(x * scale, y * scale, z * scale);
}

function RichmondMinimalSurface(u,v,target){
    /*if (u >= -1) {
        if (u <= 1) {
            if ((v >= -0.2) && (v <= 1)) {
                const denominator = 6 * (Math.pow(u, 2) + Math.pow(v, 2));
                const x = (-3 * u - Math.pow(u, 5) + 2 * Math.pow(u, 3) * Math.pow(v, 2) + 3 * u * Math.pow(v, 4)) / denominator;
                const y = (-3 * v - 3 * Math.pow(u, 4) * v - 2 * Math.pow(u, 2) * Math.pow(v, 3) + Math.pow(v, 5)) / denominator;
                const z = 2*u;

                const scale = 1
                target.set(x * scale, y * scale, z * scale);
            }
        }
    }
    const denominator = Math.pow(u, 2) + Math.pow(v, 2);
    const x = (1/3)*Math.pow(u, 3) - u*Math.pow(v,2) + u/denominator;
    const y = -1*(Math.pow(u,2)*v) + (1/3)*Math.pow(v,3) - v/denominator;
    const z = 2*u;
    const scale = 1
    target.set(x * scale, y * scale, z * scale);

}
*/
function richmond(r, t, target) {
    let rho=(1+3*radius)*r-2-radius;
    const u=Math.exp(rho)*Math.cos(2*Math.PI*t);
    const v=Math.exp(rho)*Math.sin(2*Math.PI*t);

    const x=-u/(u*u+v*v)-u*u*u/3+u*v*v;
    const y=-v/(u*u+v*v)-u*u*v+v*v*v/3;
    const z=2*u;
    target.set(y/4, z/4, -x/4);
}

function onDocumentMouseMove(event){
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function animate() {
    requestAnimationFrame( animate );


    //kleinSurface.rotation.x += 0.01;
    //kleinSurface.rotation.y += 0.01;
    render();
    //renderer.render( scene, camera );
}

function render(){

    camera.position.x += (mouseX - camera.position.x);
    camera.position.y += (mouseY - camera.position.y);

    camera.lookAt(scene.position);

    //kleinSurface.position.x = 5*Math.cos(timer);
    //kleinSurface.position.y = 5*Math.sin(timer);
    renderer.render(scene,camera);
    effect.render(scene, camera);
}

animate();

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

//
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

let threejs_matrix4 = new THREE.Matrix4();

window.addEventListener('deviceorientation', e => {
    let m2 = getRotationMatrix(e.alpha, e.beta, e.gamma);

    threejs_matrix4.set(
        m2[0], m2[1], m2[2], 0,
        m2[3], m2[4], m2[5], 0,
        m2[6], m2[7], m2[8], 0,
        0, 0, 0, 1
    );
    mesh.rotation.setFromRotationMatrix(threejs_matrix4);

    renderer.render(scene, camera);
});




