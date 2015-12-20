var React = require('react');
var ReactDOM = require('react-dom');
var ReactTHREE = require('./react-three-commonjs');
var THREE = require('three');
require('./stereoeffect');
require('./vreffect');
require('./orbitcontrols')

var Scene = ReactTHREE.Scene;
var PerspectiveCamera = ReactTHREE.PerspectiveCamera;
var MeshFactory = React.createFactory(ReactTHREE.Mesh);
var DirectionalLight = ReactTHREE.DirectionalLight;
var SpotLight = ReactTHREE.SpotLight;
var Object3D = ReactTHREE.Object3D;
var Mesh = ReactTHREE.Mesh;


var assetpath = function(filename) { return 'assets/' + filename; };
var typeface = require('three.regular.helvetiker');
THREE.typeface_js.loadFace(typeface);

var white = 0xffffff;
var orange = 0xFF903E;

var w = window.innerWidth;
var h = window.innerHeight;

var boxgeometry = new THREE.BoxGeometry( 200,200,200);
var spheregeometry = new THREE.SphereGeometry( 200,200,200);
var cylindergeometry = new THREE.CylinderGeometry( 102, 100, 40, 100);
var planegeometry = new THREE.PlaneGeometry( 10000, 10000, 100, 100);
var textgeometry = new THREE.TextGeometry("asdfasdfsf",{font: 'helvetiker'});

// Load textures
var floortexture = THREE.ImageUtils.loadTexture( assetpath('ozgungenc1.png') );
var resume1texture = THREE.ImageUtils.loadTexture( assetpath('ozgungenc1.png') );
var resume2texture = THREE.ImageUtils.loadTexture( assetpath('ozgungenc2.png') );
var bodytexture = THREE.ImageUtils.loadTexture( assetpath('simple.png'));
var headtexture = THREE.ImageUtils.loadTexture( assetpath('simple2.png'));

// Materials
var floormaterial = new THREE.MeshPhongMaterial( { map: floortexture } );
var resume1material = new THREE.MeshBasicMaterial( { map: resume1texture  } );
var resume2material = new THREE.MeshBasicMaterial( { map: resume2texture  } );
var bodymaterial = new THREE.MeshPhongMaterial({map: bodytexture});
var headmaterial = new THREE.MeshPhongMaterial({map: headtexture});
var orangematerial = new THREE.MeshPhongMaterial({color: orange});

// skybox //
var materialArray = [];
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_back.jpg') ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_front.jpg') ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_right.jpg') ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_left.jpg') ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_top.jpg') ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( assetpath('stars_top.jpg') ) }));
for (var i = 0; i < 6; i++)
   materialArray[i].side = THREE.BackSide;
var skyboxmaterial = new THREE.MeshFaceMaterial( materialArray );
var skyboxgeometry = new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1 );

// Stereo effect
//var effect = THREE.VREffect;
var effect = THREE.StereoEffect;

// Robo component
var Robo = React.createClass({
  displayName: 'Robo',
  propTypes: {
    position: React.PropTypes.instanceOf(THREE.Vector3),
    quaternion: React.PropTypes.instanceOf(THREE.Quaternion).isRequired,
  },
  render: function() {
    return <Object3D position={this.props.position || new THREE.Vector3(0,0,0)} castShadow='true' receiveShadow='false'>
      <Mesh position={new THREE.Vector3(0, +250,0)} quaternion={this.props.head.quaternion} geometry={spheregeometry} material={headmaterial} castShadow='true' receiveShadow='false'/>
      <Mesh position={new THREE.Vector3(0, +250,0)} geometry={cylindergeometry} scale={new THREE.Vector3(2,2,2)} material={orangematerial} castShadow='true' receiveShadow='false' />
      <Mesh position={new THREE.Vector3(0, -100,0)} scale={new THREE.Vector3(2.10,2.10,2.10)} quaternion={this.props.quaternion} geometry={spheregeometry} material={bodymaterial} castShadow='true' receiveShadow='false' />
    </Object3D>
  }
});

var globalX=0;
var globalY=0;

var VRScene = React.createClass({
    render: function() {
      var aspectratio = this.props.width / this.props.height;
      var cameraprops = {
        fov:90, aspect:aspectratio,
        near:1,
        far:100000,
        position:new THREE.Vector3(this.props.robodata.position.x, this.props.robodata.position.y+1600, this.props.robodata.position.z+1000),
        lookat: (Control.alphe == null) ? new THREE.Vector3(this.props.robodata.position.x+(globalX/1), -(globalY/1),this.props.robodata.position.z) : undefined,
        quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(-(Control.gamma+70)*Math.PI/180, Control.alpha*Math.PI/180, 0))
      };
      return  <Scene ref="scene" width={this.props.width} height={this.props.height} camera="maincamera" orbitControls={THREE.OrbitControls} shadowMapEnabled={true} effect={effect} >
                <PerspectiveCamera name="maincamera" {...cameraprops}   />
                <Robo position={this.props.robodata.position} quaternion={this.props.robodata.quaternion} head={this.props.robodata.head} onKeyPress={this.keyHandler} castShadow={true} receiveShadow={false} />
                <DirectionalLight position={new THREE.Vector3(1000,1000,1000)} color={white} intensity={1} />
                <DirectionalLight onlyShadow='false' position={new THREE.Vector3(0,10000,0)} lookat={new THREE.Vector3(0,0,0)} color={orange} intensity={100} castShadow='true' shadowCameraLeft={-15000} shadowCameraRight={10000} shadowCameraTop={30000} shadowCameraBottom={-5000} shadowCameraNear={1} shadowCameraFar={100000} shadowMapWidth={2048} shadowMapHeight={2048}/>
                <Object3D quaternion={new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI / 2 )} receiveShadow={true} >
                  <Mesh position={new THREE.Vector3(0,0,0)} geometry={planegeometry} material={resume1material} receiveShadow={true} />
                  <Mesh position={new THREE.Vector3(0,-10000,0)} geometry={planegeometry} material={resume2material} receiveShadow={true} />
                  <Mesh position={new THREE.Vector3(0,0,0)} geometry={skyboxgeometry} material={skyboxmaterial} receiveShadow={false} />
                </Object3D>
              </Scene>;
    },
});

var Control = {
  up: false,
  down:false,
  left: false,
  right: false,
  X: 0, prevX: null,
  Y: 0, prevY: null,
  alpha: null, prevAlpha: null,
  beta: null, prevBeta: null,
  gamma: null, prevGamma: null,
  keyHandler: function(e){
    e = e || window.event;
    if (e.keyCode == '38') {
      if (e.type == 'keydown') Control.up = true;
      else if (e.type == 'keyup') Control.up = false;
    }
    if (e.keyCode == '40') {
      if (e.type == 'keydown') Control.down = true;
      else if (e.type == 'keyup') Control.down = false;
    }
    if (e.keyCode == '37') {
      if (e.type == 'keydown') Control.left = true;
      else if (e.type == 'keyup') Control.left = false;
    }
    if (e.keyCode == '39') {
      if (e.type == 'keydown') Control.right = true;
      else if (e.type == 'keyup') Control.right = false;
    }
    if (e.type == 'keyup' && 'C' == String.fromCharCode(e.keyCode)) {
      props.robodata.position = new THREE.Vector3(0,300,0);
      globalX=0;
      globalY=0;
    }
  },
  mouseHandler: function (e){
    e.preventDefault();
    Control.X = e.clientX;
    if (Control.prevX) globalX += Control.X - Control.prevX;
    Control.prevX = Control.X;
    Control.Y = e.clientY;
    if (Control.prevY) globalY += Control.Y - Control.prevY;
    Control.prevY = Control.Y;
  },
  orientationHandler: function (e){
    e.preventDefault();
    Control.alpha = e.alpha;
    Control.beta = e.beta;
    Control.gamma = e.gamma;
  }

}


var props = {
   width: w,
   height: h,
   robodata: {
     position:new THREE.Vector3(-1325,300,-4000),
     quaternion:new THREE.Quaternion(),
     head: {
       position:new THREE.Vector3(-1325,300,-4000),
       quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2)
     }
   },
 };

var element = React.createElement(VRScene, props);

window.onkeydown = Control.keyHandler;
window.onkeyup = Control.keyHandler;
window.onmousemove = Control.mouseHandler;
window.ondeviceorientation = Control.orientationHandler;

var xstep = 0, zstep = 0;
var friction = 1.1

function render(t){
    if (Control.up) zstep -= 1
    else if (Control.down) zstep += 1
    else zstep /= friction;

    if (Control.left) xstep -= 1
    else if (Control.right) xstep += 1
    else xstep /= friction;

    if (!Control.left && !Control.right && !Control.up && !Control.down ){
      globalX *= .99;
      globalY *= .99;
    }

    props.robodata.position.z += zstep;
    //if (Control.down) props.robodata.position.z += zstep;
    props.robodata.position.x += xstep;
    //if (Control.right) props.robodata.position.x += xstep;

    var rotationanglex = props.robodata.position.x/100 % Math.PI*2;
    var rotationangley = 0;
    var rotationanglez = props.robodata.position.z/100 % Math.PI*2;
    props.robodata.quaternion.setFromEuler(new THREE.Euler(rotationanglez, rotationangley, -rotationanglex, 'XZY'));

    //props.robodata.head.quaternion.rotate(new THREE.Vector3 (0,0,1), Math.PI/180);

    element = React.createElement(VRScene, props);
    ReactTHREE.render(element, document.querySelector('#container'));
    requestAnimationFrame(render);

}
render(0);
