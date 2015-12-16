var React = require('react');
var ReactDOM = require('react-dom');
var ReactTHREE = require('react-three');
var THREE = require('three');

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
var orange = 0xff5500;

var boxgeometry = new THREE.BoxGeometry( 200,200,200);
var spheregeometry = new THREE.SphereGeometry( 200,200,200);
var cylindergeometry = new THREE.CylinderGeometry( 102, 100, 40, 100);
var planegeometry = new THREE.PlaneGeometry( 10000, 10000, 100, 100);
var textgeometry = new THREE.TextGeometry("asdfasdfsf",{font: 'helvetiker'});


// Load textures
var floortexture = THREE.ImageUtils.loadTexture( assetpath('ozgungenc1.png') );
var resume2texture = THREE.ImageUtils.loadTexture( assetpath('ozgungenc2.png') );
var creamtexture = THREE.ImageUtils.loadTexture( assetpath('simple.png'));

// Materials
var floormaterial = new THREE.MeshPhongMaterial( { map: floortexture } );
var solidmaterial = new THREE.MeshBasicMaterial( { map: floortexture  } );
var creammaterial = new THREE.MeshPhongMaterial({map: creamtexture});
var orangematerial = new THREE.MeshPhongMaterial({color: orange});

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
      <Mesh position={new THREE.Vector3(0, +100,0)} scale={new THREE.Vector3(.5,.5,.5)} geometry={spheregeometry} material={creammaterial} quaternion={this.props.quaternion || new THREE.Quaternion()} castShadow='true' receiveShadow='false'/>
      <Mesh position={new THREE.Vector3(0, +95,0)} geometry={cylindergeometry} material={orangematerial} castShadow='true' receiveShadow='false' />
      <Mesh position={new THREE.Vector3(0, -100,0)} scale={new THREE.Vector3(1.05,1.05,1.05)} quaternion={this.props.quaternion} geometry={spheregeometry} material={creammaterial} castShadow='true' receiveShadow='false' />
    </Object3D>
  }
});


var VRScene = React.createClass({
    render: function() {
      var aspectratio = this.props.width / this.props.height;
      var cameraprops = {fov:50, aspect:aspectratio, near:1, far:100000,
        position:new THREE.Vector3(this.props.cupcakedata.position.x, this.props.cupcakedata.position.y+800, this.props.cupcakedata.position.z+1000), lookat:this.props.cupcakedata.position};
      return  <Scene width={this.props.width} height={this.props.height} camera="maincamera" shadowMapEnabled={false} >
                <PerspectiveCamera name="maincamera" {...cameraprops} />
                <Robo position={this.props.cupcakedata.position} quaternion={this.props.cupcakedata.quaternion} onKeyPress={this.keyHandler} castShadow={true} receiveShadow={false} />
                <DirectionalLight position={new THREE.Vector3(1000,1000,1000)} color={white} intensity={1} />
                <SpotLight onlyShadow='true' position={new THREE.Vector3(-this.props.cupcakedata.position.x, this.props.cupcakedata.position.y+10000, -this.props.cupcakedata.position.z)} color={white} intensity={1}  castShadow='true' shadowCameraLeft={-1000} shadowCameraRight={1000} shadowCameraTop={10000} shadowCameraBottom={-10000} shadowCameraNear={1} shadowCameraFar={100000} shadowMapWidth={2048} shadowMapWidth={2048} />
                <Object3D quaternion={new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI / 2 )} receiveShadow={false} >
                  <Mesh position={new THREE.Vector3(0,0,0)} geometry={planegeometry} material={solidmaterial} receiveShadow={false} />
                </Object3D>
              </Scene>;
    },

});

var w = window.innerWidth;
var h = window.innerHeight;

var Control = {
  up: false,
  down:false,
  left: false,
  right: false,
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
    }
  }
}


var props = {
   width: w,
   height: h,
   cupcakedata: {
     position:new THREE.Vector3(0,300,0),
     quaternion:new THREE.Quaternion()
   }
 };

var element = React.createElement(VRScene, props);

window.onkeydown = Control.keyHandler;
window.onkeyup = Control.keyHandler;

var xstep = 0, zstep = 0;
var friction = 1.1

function render(t){
    if (Control.up) zstep -= 1
    else if (Control.down) zstep += 1
    else zstep /= friction;

    if (Control.left) xstep -= 1
    else if (Control.right) xstep += 1
    else xstep /= friction;

    props.cupcakedata.position.z += zstep;
    //if (Control.down) props.cupcakedata.position.z += zstep;
    props.cupcakedata.position.x += xstep;
    //if (Control.right) props.cupcakedata.position.x += xstep;

    var rotationanglex = props.cupcakedata.position.x/100;
    var rotationangley = 0;
    var rotationanglez = props.cupcakedata.position.z/100;
    props.cupcakedata.quaternion.setFromEuler(new THREE. Euler(rotationanglez, rotationangley, rotationanglex));

    element = React.createElement(VRScene, props);
    ReactTHREE.render(element, document.querySelector('#container'));
    requestAnimationFrame(render);

}
render(0);
