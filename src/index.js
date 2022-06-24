import {
    AmbientLight,
    DirectionalLight,
    Clock,
    SphereGeometry,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Vector3,
    CubeTextureLoader
} from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import * as Util from './util';
import ft from '../asset/corona_ft.png';
import bk from '../asset/corona_bk.png';
import lf from '../asset/corona_lf.png';
import rt from '../asset/corona_rt.png';
import up from '../asset/corona_up.png';
import dn from '../asset/corona_dn.png';
let camera, scene, renderer, controls, clock;
let sun, earth, moon;
// eslint-disable-next-line
let physics, deltaTime;
class Physics {
    constructor( planets ) {
        this.planets = planets;
    }
    updatePosition() {
        deltaTime = clock.getDelta();
        this.planets.forEach( planet => {
            planet.setPosition(
                planet.velocity.x * deltaTime + planet.mesh.position.x,
                planet.velocity.y * deltaTime + planet.mesh.position.y,
                planet.velocity.z * deltaTime + planet.mesh.position.z
            )
            for( var fPlanet of this.planets ) {
                if( planet != fPlanet ) {
                    planet.velocity.add(
                        Util.force( planet, fPlanet ).divideScalar( planet.mass )
                    )
                }
            }
        })
    }
}
// Planets, Stars
class CelestialObject{
    constructor( radius, mass, color ) {
        this.mesh = new Mesh( new SphereGeometry( radius ), new MeshPhongMaterial( { color: color } ) );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mass = mass;
        this.velocity = new Vector3( 0, 0, 0 );
    }
    setPosition( x, y, z ) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
    getPosition() {
        return this.mesh.position;
    }
    setVelocity( velocity ) {
        this.velocity = velocity;
    }
}
init();
animate();
function init() {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;

    scene = new Scene();

    camera = new PerspectiveCamera( 50, ASPECT_RATIO, 0.1, 10000 );
    camera.position.set( 0, 1000, 1000 );

    scene.add( new AmbientLight( 0x0a0a0a ) );

    const ambientLight = new AmbientLight( 0xffffff, 0.5 );
    const light = new DirectionalLight( 0xffffff, 0.5 );
    // light.position.set( -100, 0, 0 );
    // light.castShadow = true;
    // light.shadow.camera.zoom = 2; // tighter shadow map
    scene.add( light, ambientLight );

    sun = new CelestialObject( 50, 100, 0xffffff );
    sun.setPosition( 0, 0, 0 );
    earth = new CelestialObject( 12, 20, 0x88eeaa );
    earth.setPosition( 200, 0, 0 );
    earth.setVelocity( new Vector3( 0, -30, 0 ) );
    moon = new CelestialObject( 3, 0.1, 0xffffaa );
    moon.setPosition( 225, 0, 0 );
    moon.setVelocity( new Vector3( 0, 5, 0 ) );
    scene.add( moon.mesh, earth.mesh, sun.mesh );
    physics = new Physics( [ sun, moon, earth ] );

    const loader = new CubeTextureLoader();
    const texture = loader.load([ ft, bk, up, dn, rt, lf ]);
    scene.background = texture;

    clock = new Clock();
    clock.start();

    renderer = new WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    
    window.addEventListener( 'resize', onWindowResize );
    createControl( camera );
}
function createControl( camera ) {
    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 10.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
}
function onWindowResize() {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    animator();
    requestAnimationFrame( animate );
    controls.update();
    render();
}
function render() {
    renderer.render( scene, camera );
}
function animator() {
    physics.updatePosition();
}