var React = require('react');
var ReactDOM = require('react-dom');
var ReactTHREE = require('react-three');
var THREE = require('three');

var Scene = ReactTHREE.Scene;
var PerspectiveCamera = ReactTHREE.PerspectiveCamera;
var MeshFactory = React.createFactory(ReactTHREE.Mesh);
var DirectionalLight = ReactTHREE.DirectionalLight;


var assetpath = function(filename) { return 'assets/' + filename; };

var boxgeometry = new THREE.BoxGeometry( 200,200,200);
var cupcaketexture = THREE.ImageUtils.loadTexture( assetpath('cupCake.png') );
var cupcakematerial = new THREE.MeshPhongMaterial( { map: cupcaketexture } );

var creamtexture = THREE.ImageUtils.loadTexture( assetpath('creamPink.png'));
var creammaterial = new THREE.MeshPhongMaterial({map: creamtexture});


var Cupcake = React.createClass({
  displayName: 'Cupcake',
  propTypes: {
    position: React.PropTypes.instanceOf(THREE.Vector3),
    quaternion: React.PropTypes.instanceOf(THREE.Quaternion).isRequired
  },
  render: function() {
    return React.createElement(
      ReactTHREE.Object3D,
      {quaternion:this.props.quaternion, position:this.props.position || new THREE.Vector3(0,0,0)},
      MeshFactory({position:new THREE.Vector3(0,-100,0), geometry:boxgeometry, material:cupcakematerial}),
      MeshFactory({position:new THREE.Vector3(0, 100,0), geometry:boxgeometry, material:creammaterial})
    );
  }
});
var color = 0xff1250;

var Hello = React.createClass({
    render: function() {
      var aspectratio = this.props.width / this.props.height;
      var cameraprops = {fov:75, aspect:aspectratio, near:1, far:5000,
        position:new THREE.Vector3(0,0,600), lookat:new THREE.Vector3(0,0,0)};
      console.log(this.props.cupcakedata)
      return  <Scene width={this.props.width} height={this.props.height} camera="maincamera">
                <PerspectiveCamera name="maincamera" {...cameraprops} />
                <Cupcake position={this.props.cupcakedata.position} quaternion={this.props.cupcakedata.quaternion} />
                <DirectionalLight position={new THREE.Vector3(0,0,1)} color={color} intensity={1} />
              </Scene>;
    }

});

var w = window.innerWidth-6;
var h = window.innerHeight-6;

var props = {
   width: w,
   height: h,
   cupcakedata: {
     position:new THREE.Vector3(0,0,0),
     quaternion:new THREE.Quaternion()
   }
 };

var element = React.createElement(Hello, props);

function render(t){
    console.log(t);
    rotationangle = t*.001;
    props.cupcakedata.quaternion.setFromEuler(new THREE. Euler(rotationangle, 3*rotationangle, 0));
    props.cupcakedata.position.x = 300  * Math.sin(rotationangle);
    element = React.createElement(Hello, props);


    ReactTHREE.render(element, document.querySelector('.container'));
    requestAnimationFrame(render);

}
render(0);
