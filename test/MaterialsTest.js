var sys = require('pex-sys');
var glu = require('pex-glu');
var geom = require('pex-geom');
var color = require('pex-color');

var Window = sys.Window;
var Sphere = geom.gen.Sphere;
var Cube = geom.gen.Cube;
var Mesh = glu.Mesh;
var PerspectiveCamera = glu.PerspectiveCamera;
var Arcball = glu.Arcball;
var Color = color.Color;
var Vec3 = geom.Vec3;
var Texture2D = glu.Texture2D;

var ShowNormals = require('../lib/ShowNormals');
var SolidColor = require('../lib/SolidColor');
var ShowColors = require('../lib/ShowColors');
var Textured = require('../lib/Textured');
var FlatToonShading = require('../lib/FlatToonShading');
var MatCap = require('../lib/MatCap');

var DPI = 2;

Window.create({
  settings: {
    width: 1024 * DPI,
    height: 768 * DPI,
    type: '3d',
    fullscreen: sys.Platform.isBrowser,
    highdpi: DPI
  },
  init: function() {
    this.camera = new PerspectiveCamera(60, this.width / this.height);
    this.arcball = new Arcball(this, this.camera);

    this.meshes = [];

    var sphere = new Sphere(0.75);
    var colors = sphere.vertices.map(function() {
      return new Color(Math.random(), Math.random(), Math.random(), 1.0);
    })
    sphere.addAttrib('colors', 'color', colors);

    this.meshes.push(new Mesh(sphere, new SolidColor({ color: Color.Red }), { triangles: true }));
    this.meshes.push(new Mesh(sphere, new ShowNormals(), { triangles: true }));
    this.meshes.push(new Mesh(sphere, new ShowColors(), { triangles: true }));
    this.meshes.push(new Mesh(sphere, new Textured({ texture: Texture2D.load('assets/plask.png') }), { triangles: true }));
    this.meshes.push(new Mesh(sphere, new FlatToonShading({ colorBands: Texture2D.load('assets/palette_green.png') }), { triangles: true }));
    this.meshes.push(new Mesh(sphere, new MatCap({ texture: Texture2D.load('assets/matcap.jpg') }), { triangles: true }));
  },
  draw: function() {
    glu.clearColorAndDepth(Color.Black);
    glu.enableDepthWriteAndRead(true);

    var cols = 3;
    var rows = 3;
    var index = 0;
    var dw = 1/cols * this.width;
    var dh = 1/rows * this.height;
    this.camera.setAspectRatio(dw/dh);
    for(var j=0; j<rows; j++) {
      for(var i=0; i<cols; i++) {
        glu.viewport(i * dw, this.height - dh - j * dh, dw, dh);
        var mesh = this.meshes[index++];
        if (mesh) {
          mesh.draw(this.camera);
        }
      }
    }
  }
});