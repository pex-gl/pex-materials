var Window          = require('pex-sys/Window');
var PerspCamera     = require('pex-cam/PerspCamera');
var Arcball         = require('pex-cam/Arcball');
var createRoundedCube      = require('primitive-rounded-cube');
var glslify         = require('glslify-promise');
var isBrowser       = require('is-browser');
var grid            = require('grid-cells');
var SolidColor      = require('../solid-color');
var ShowNormals     = require('../show-normals');
var ShowTexCoords   = require('../show-tex-coords');
var ShowColors      = require('../show-colors');
var Textured        = require('../textured');
var Diffuse         = require('../diffuse');
var MatCap          = require('../mat-cap');
var PointSpriteSolidColor = require('../point-sprite-solid-color');
var PointSpriteShowColors = require('../point-sprite-show-colors');
var PointSpriteTextured   = require('../point-sprite-textured');

var ASSETS_DIR = isBrowser ? 'assets' : __dirname + '/assets';

Window.create({
    settings: {
        width:  1280,
        height: 512,
        fullScreen: isBrowser ? true : false
    },
    resources: {
        pexImage: { image: ASSETS_DIR + '/pex.png' },
        matCapImage: { image: ASSETS_DIR + '/generator11.jpg' },
        particleImage: { image: ASSETS_DIR + '/particle.png' }
    },
    init: function() {
        try {
        var ctx = this.getContext();
        var res = this.getResources();
        this.cells = grid(this.getWidth(), this.getHeight(), 5, 2, 0);

        this.camera  = new PerspCamera(45, this.cells[0][2]/this.cells[0][3], 0.001, 20.0);
        this.camera.lookAt([0, 1, 3], [0, 0, 0]);
        ctx.setProjectionMatrix(this.camera.getProjectionMatrix());

        this.arcball = new Arcball(this.camera, this.getWidth(), this.getHeight());
        this.arcball.setDistance(3.0);
        this.addEventListener(this.arcball);


        var cube = createRoundedCube(1, 1, 1, 20, 20, 20, 0.1);
        var colors = cube.positions.map(function() {
            return [Math.random(), Math.random(), Math.random(), 1];
        });
        var cubeAttributes = [
            { data: cube.positions, location: ctx.ATTRIB_POSITION },
            { data: cube.normals, location: ctx.ATTRIB_NORMAL },
            { data: cube.uvs, location: ctx.ATTRIB_TEX_COORD_0 },
            { data: colors, location: ctx.ATTRIB_COLOR }
        ];
        var cubeIndices = { data: cube.cells };
        this.cubeMesh = ctx.createMesh(cubeAttributes, cubeIndices, ctx.TRIANGLES);
        this.cubePointsMesh = ctx.createMesh(cubeAttributes, cubeIndices, ctx.POINTS);

        this.pexTexture = ctx.createTexture2D(res.pexImage);
        this.matCapTexture = ctx.createTexture2D(res.matCapImage);
        this.particleTexture = ctx.createTexture2D(res.particleImage);

        this.materials = [
            { program: ctx.createProgram(SolidColor.Vert, SolidColor.Frag), uniforms: { uColor:[1,0,0,1] }},
            { program: ctx.createProgram(ShowNormals.Vert, ShowNormals.Frag) },
            { program: ctx.createProgram(ShowTexCoords.Vert, ShowTexCoords.Frag) },
            { program: ctx.createProgram(ShowColors.Vert, ShowColors.Frag) },
            { program: ctx.createProgram(Textured.Vert, Textured.Frag), uniforms: { uTexture: this.pexTexture }},
            { program: ctx.createProgram(Diffuse.Vert, Diffuse.Frag), uniforms: { uLightPos: [10,10,10], uDiffuseColor: [1,0,0,1]} },
            { program: ctx.createProgram(MatCap.Vert, MatCap.Frag), uniforms: { uTexture: this.matCapTexture }},
            { program: ctx.createProgram(PointSpriteSolidColor.Vert, PointSpriteSolidColor.Frag), uniforms: { uPointSize: 2, uColor: [1, 0, 0, 1] }},
            { program: ctx.createProgram(PointSpriteShowColors.Vert, PointSpriteShowColors.Frag), uniforms: { uPointSize: 2 }},
            { program: ctx.createProgram(PointSpriteTextured.Vert, PointSpriteTextured.Frag), uniforms: { uPointSize: 10, uTexture: this.particleTexture, uColor: [1, 1, 0, 1] }, blendFunc: [ctx.SRC_COLOR, ctx.ONE]},
        ]
        }
        catch(e) {
            console.log(e);
            console.log(e.stack);
            process.exit();
        }
    },
    draw: function() {
        var ctx = this.getContext();

        var H = this.getHeight();

        this.arcball.apply();
        ctx.setViewMatrix(this.camera.getViewMatrix());

        ctx.setClearColor(0.2, 0.2, 0.2, 1);
        ctx.clear(ctx.COLOR_BIT | ctx.DEPTH_BIT);
        ctx.setDepthTest(true);

        this.cells.forEach(function(cell, cellIndex) {
            var material = this.materials[cellIndex];
            if (!material) return;
            ctx.bindProgram(material.program);
            var numTextures = 0;
            for(var uniformName in material.uniforms) {
                var uniformValue = material.uniforms[uniformName];
                if (uniformValue.getTarget && uniformValue.getTarget() == ctx.TEXTURE_2D) {
                    ctx.bindTexture(uniformValue, numTextures);
                    numTextures++;
                }
                else {
                    material.program.setUniform(uniformName, uniformValue);
                }
            }
            ctx.setViewport(cell[0], H - cell[1] - cell[3], cell[2], cell[3]);
            if (material.uniforms && material.uniforms.uPointSize) {
                ctx.bindMesh(this.cubePointsMesh);
            }
            else {
                ctx.bindMesh(this.cubeMesh);
            }
            if (material.blendFunc) {
                ctx.pushState(ctx.BLEND_BIT);
                ctx.setBlend(true);
                ctx.setBlendFunc(material.blendFunc[0], material.blendFunc[1]);
                ctx.drawMesh();
                ctx.popState()
            }
            else {
                ctx.drawMesh();
            }
        }.bind(this));
    }
})
