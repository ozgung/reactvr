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

// Stereo effect
//var effect = THREE.VREffect;
var effect = THREE.StereoEffect;

// Robo component
var Robo = React.createClass({
  displayName: 'Robo',
  propTypes: {
    position: React.PropTypes.instanceOf(THREE.Vector3),
    quaternion: React.PropTypes.instanceOf(THREE.Quaternion).isRequired,
    quaternion2: React.PropTypes.instanceOf(THREE.Quaternion)
  },
  render: function() {
    return <Object3D position={this.props.position || new THREE.Vector3(0,0,0)} castShadow='true' receiveShadow='false'>
      <Mesh position={new THREE.Vector3(0, +250,0)} quaternion={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2)} geometry={spheregeometry} material={headmaterial} castShadow='true' receiveShadow='false'/>
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
        position:new THREE.Vector3(this.props.cupcakedata.position.x, this.props.cupcakedata.position.y+1600, this.props.cupcakedata.position.z+1000),
        lookat: (Control.alphe == null) ? new THREE.Vector3(this.props.cupcakedata.position.x+(globalX/1), -(globalY/1),this.props.cupcakedata.position.z) : undefined,
        quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(-(Control.gamma+70)*Math.PI/180, Control.alpha*Math.PI/180, 0))
      };
      return  <Scene ref="scene" width={this.props.width} height={this.props.height} camera="maincamera" orbitControls={THREE.OrbitControls} shadowMapEnabled={false} effect={effect} >
                <PerspectiveCamera name="maincamera" {...cameraprops}   />
                <Robo position={this.props.cupcakedata.position} quaternion={this.props.cupcakedata.quaternion} onKeyPress={this.keyHandler} castShadow={true} receiveShadow={false} />
                <DirectionalLight position={new THREE.Vector3(1000,1000,1000)} color={white} intensity={1} />
                <SpotLight onlyShadow='true' position={new THREE.Vector3(-this.props.cupcakedata.position.x, this.props.cupcakedata.position.y+10000, -this.props.cupcakedata.position.z)} color={white} intensity={1}  castShadow='true' shadowCameraLeft={-1000} shadowCameraRight={1000} shadowCameraTop={10000} shadowCameraBottom={-10000} shadowCameraNear={1} shadowCameraFar={100000} shadowMapWidth={2048} shadowMapWidth={2048} />
                <Object3D quaternion={new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI / 2 )} receiveShadow={false} >
                  <Mesh position={new THREE.Vector3(0,0,0)} geometry={planegeometry} material={resume1material} receiveShadow={false} />
                  <Mesh position={new THREE.Vector3(0,-10000,0)} geometry={planegeometry} material={resume2material} receiveShadow={false} />
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
      props.cupcakedata.position = new THREE.Vector3(0,300,0);
      globalX=0;
      globalY=0;
    }
  },
  mouseHandler: function (e){
    e.preventDefault();
    Control.X = e.clientX;
    if (Control.prevX) globalX += Control.X - Control.prevX;
    console.log(globalX);
    Control.prevX = Control.X;
    Control.Y = e.clientY;
    if (Control.prevY) globalY += Control.Y - Control.prevY;
    console.log(globalY);
    Control.prevY = Control.Y;
  },
  orientationHandler: function (e){
    console.log(e);
    e.preventDefault();
    Control.alpha = e.alpha;
    Control.beta = e.beta;
    Control.gamma = e.gamma;
    // if (Control.prevX) globalX += Control.X - Control.prevX;
    console.log(Control.alpha);
    console.log(Control.beta);
    console.log(Control.gamma);
    // Control.prevX = Control.X;
    // Control.Y = e.clientY;
    // if (Control.prevY) globalY += Control.Y - Control.prevY;
    // console.log(globalY);
    // Control.prevY = Control.Y;
  }

}


var props = {
   width: w,
   height: h,
   cupcakedata: {
     position:new THREE.Vector3(-1325,300,-4000),
     quaternion:new THREE.Quaternion()
   }
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

    props.cupcakedata.position.z += zstep;
    //if (Control.down) props.cupcakedata.position.z += zstep;
    props.cupcakedata.position.x += xstep;
    //if (Control.right) props.cupcakedata.position.x += xstep;

    var rotationanglex = props.cupcakedata.position.x/100;
    var rotationangley = 0;
    var rotationanglez = props.cupcakedata.position.z/100;
    props.cupcakedata.quaternion.setFromEuler(new THREE.Euler(rotationanglez, rotationangley, rotationanglex));

    element = React.createElement(VRScene, props);
    ReactTHREE.render(element, document.querySelector('#container'));
    requestAnimationFrame(render);

}
render(0);
