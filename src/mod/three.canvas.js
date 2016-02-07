"use strict";
var Widget = require("wdg");

var registeredAnimations = [];

function animate(time) {
    if (registeredAnimations.length > 0) {
        registeredAnimations.forEach(function (item) {
            item.render( time );
        });
        window.requestAnimationFrame( animate );
    }
}

function Register(anim) {
    if (registeredAnimations.indexOf(anim) == -1) {
        registeredAnimations.push(anim);
        if (registeredAnimations.length == 1) {
            window.requestAnimationFrame( animate );
        }
    }
}

function Unregister(anim) {
    var pos = registeredAnimations.indexOf(anim);
    if (pos > -1) {
        registeredAnimations.splice(pos, 1);
    }
}

/**
 * @example
 * var Canvas = require("three.canvas");
 * var options = {
 *    width: 640,
 *    height: 480
 * };
 * var instance = new Canvas(options);
 * @class Canvas
 */
var Canvas = function(options) {
    Widget.call(this);
    this.addClass("three-canvas");

    if (typeof options === 'undefined') options = {};
    if (typeof options.width === 'undefined') options.width = window.innerWidth;
    if (typeof options.height === 'undefined') options.height = window.innerHeight;

    this.W = options.width;
    this.H = options.height;
    this.css({
        width: this.W + "px",
        height: this.H + "px"
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 45, this.W / this.H, 0.1, 1000 );
    this.camera.position.z = 1.4;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor( 0xffffff, 0);
    this.renderer.setSize( this.W, this.H );
    this.append( this.renderer.domElement );
    this._time = 0;

    var ang = Math.random() * 2 * Math.PI;
    this.x = (.7 + Math.random() * .3) * Math.cos( ang );
    this.y = (.7 + Math.random() * .3) * Math.sin( ang );
    this.z = (.2 + Math.random() * .5) * Math.cos( Math.random() * 2 * Math.PI );
    this.vx = (2 * Math.random() - 1) * 0.002;
    this.vy = (2 * Math.random() - 1) * 0.002;
    this.vz = (2 * Math.random() - 1) * 0.002;
};

// Extension of Widget.
Canvas.prototype = Object.create(Widget.prototype);
Canvas.prototype.constructor = Canvas;

/**
 * @return void
 */
Canvas.prototype.render = function(time) {
    if (this._time <= 0) this._time = time - 1;
    this.onRender(time, time - this._time);
    this.renderer.render( this.scene, this.camera );
    this._time = time;
};

/**
 * @return void
 */
Canvas.prototype.onRender = function(time, delta) {
    var x = 70 * this.x * .5;
    var y = 70 * this.y * .5;

    this.css({
        transform: 'translate(' + x + 'vw,' + y + 'vh)',
        'z-index': Math.floor( Math.floor( 10000 * (2 + this.z) ) )
    });

    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    if ( this.x > 0 ) this.vx -= 0.00001;
    if ( this.x < 0 ) this.vx += 0.00001;
    if ( this.y > 0 ) this.vy -= 0.00001;
    if ( this.y < 0 ) this.vy += 0.00001;
    if ( this.z > 0 ) this.vz -= 0.00001;
    if ( this.z < 0 ) this.vz += 0.00001;
};

/**
 * @return void
 */
Canvas.prototype.start = function() {
    Register(this);
};

/**
 * @return void
 */
Canvas.prototype.stop = function() {
    Unregister(this);
};


/**
 * @return void
 */
Canvas.prototype.createMesh = function(opt) {
    if (typeof opt === 'undefined') throw Error("[three.canvas.createMesh] Missing optument!");
    if (typeof opt.colors === 'undefined') opt.colors = [
        new THREE.Color( .5 + Math.random() * .5, .5 + Math.random() * .5, .5 + Math.random() * .5 )
    ];
    if (typeof opt.nbColors === 'undefined') opt.nbColors = opt.colors.length;
    if (typeof opt.solid === 'undefined') opt.solid = true;
    if (typeof opt.wireframe === 'undefined') opt.wireframe = true;
    if (typeof opt.wirecolor === 'undefined') opt.wirecolor = new THREE.Color( 0x333333 );
    if (typeof opt.wirewidth === 'undefined') opt.wirewidth = 2;
    if (typeof opt.doublesided === 'undefined') opt.doublesided = false;

    if (typeof opt.mat === 'undefined') opt.mat = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 3.14,
        metal: true,
        vertexColors: THREE.VertexColors,
        side: opt.doublesided ? THREE.DoubleSide : THREE.FrontSide,
        transparent: true,
        opacity: .9
    });;

    var grp = new THREE.Group();

    if (opt.solid) {
        var geo = new THREE.Geometry();
        opt.vertices.forEach(function (vertex) {
            geo.vertices.push( new THREE.Vector3( vertex[0], vertex[1], vertex[2] ) );
        });
        opt.faces.forEach(function (face, idxFace) {
            addFace( geo, face, opt.colors[idxFace % opt.nbColors] );
        });
        geo.computeFaceNormals ();
        geo.computeVertexNormals ();
        grp.add( new THREE.Mesh( geo, opt.mat ) );
    }

    if (opt.wireframe) {
        var mat = new THREE.LineBasicMaterial({ color: opt.wirecolor, linewidth: opt.wirewidth });
        var cache = [];
        opt.faces.forEach(function (face) {
            var line;
            var key, a, b, tmp;
            for( var i=0 ; i<face.length ; i++ ) {
                a = face[i];
                b = face[(i + 1) % face.length];
                if (b < a) {
                    tmp = a;
                    a = b;
                    b = tmp;
                }
                key = a + "," + b;
                if (cache.indexOf( key ) == -1) {
                    cache.push( key );
                    line = new THREE.Geometry();
                    line.vertices.push(
                        new THREE.Vector3( 
                            opt.vertices[a][0], opt.vertices[a][1], opt.vertices[a][2] ),
                        new THREE.Vector3( 
                            opt.vertices[b][0], opt.vertices[b][1], opt.vertices[b][2] )
                    );
                    line.type = THREE.Lines;
                    grp.add( new THREE.Line( line, mat ) );
                }
            }
        });
    }
    return grp;
};


function addFace(geometry, vertices, color) {
    var faces = [];
    if (vertices.length == 3) {
        faces.push(
            new THREE.Face3( vertices[0], vertices[1], vertices[2] )
        );
    }
    else if (vertices.length == 4) {
        faces.push(
            new THREE.Face3( vertices[0], vertices[1], vertices[2] ),
            new THREE.Face3( vertices[0], vertices[2], vertices[3] )
        );
    }
    else {
        // We use the fan method.
        var x = 0, y = 0, z = 0;
        vertices.forEach(function (idx) {
            var vertex = geometry.vertices[vertices[idx]];
            x += vertex.x;
            y += vertex.y;
            z += vertex.z;
        });
        x /= vertices.length;
        y /= vertices.length;
        z /= vertices.length;

        var k = vertices.length;
        geometry.vertices.push( new THREE.Vector3( x, y, z ) );

        var i;
        for( i=0 ; i<k ; i++ ) {
            faces.push( new THREE.Face3( i, (i + 1) % k, k ) );
        }
    }

    if (typeof color !== 'undefined') {
        // Apply a color to this face.
        faces.forEach(function (face) {
            face.vertexColors[0] = face.vertexColors[1] = face.vertexColors[2] = color;
        });
    }

    faces.forEach(function (face) {
        geometry.faces.push(face);
    });
}


Canvas.create = function(options) {
    return new Canvas(options);
};
module.exports = Canvas;
