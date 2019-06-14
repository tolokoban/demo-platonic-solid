"use strict";
var ThreeCanvas = require("three.canvas");
var Rotator = require("three.rotator");


/**
 * @example
 * var Solide = require("platon.solide");
 * var instance = new Solide();
 * @class Solide
 */
var Solide = function(options) {
    if (typeof options === 'undefined') options = {};
    if (typeof options.faces === 'undefined') options.faces = 4;
    if (typeof options.width === 'undefined') options.width = 150;
    if (typeof options.height === 'undefined') options.height = 150;


    ThreeCanvas.call(this, {width: options.width, height: options.height});
    this.addClass("platon-solide");

    this.camera.position.z = 2.7;

    var light = new THREE.HemisphereLight( 0xcceeff, 0x990000, 3.6 ); // soft white light
    var light1 = new THREE.DirectionalLight( 0x997777, 5 );
    var light2 = new THREE.DirectionalLight( 0x777799, 2 );
    light1.position.set(43,13,5);
    light2.position.set(-20,5,1);

    var cube = this.createSolid( options.faces );

    this.scene.add( cube );
    this.scene.add( light1 );
    this.scene.add( light2 );
    this.scene.add( light );

    this._rotator = new Rotator( cube );    

    this.start();
};

// Extension of Widget.
Solide.prototype = Object.create(ThreeCanvas.prototype);
Solide.prototype.constructor = Solide;

/**
 * @return void
 */
Solide.prototype.onRender = function(time, delta) {
    ThreeCanvas.prototype.onRender.call( this, time, delta );

    this._rotator.rotate( time );

    if (this._blinker) {
        var opacity = Math.cos(time * 0.0001 * Math.PI);
        if (opacity > 0.2) {
            opacity = Math.min( 1, (opacity - .2) * 5 );
            this._blinker.visible = true;
            this._blinker.children.forEach(function (line) {
                line.material.opacity = opacity;
            });
        } else {
            this._blinker.visible = false;
        }
    }
/*
    var x = 20 * Math.abs(Math.cos(time / (sx + sy + sz)));
    var y = 2 * Math.cos(3 * time / (sx + sy + sz));
    this.css('transform', 'translate(-' + x + 'em,' + y + 'em)');
*/
};

/**
 * @return void
 */
Solide.prototype.getTetrahedronGeometry = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius / Math.sqrt(3);
    return {
        vertices: [ [ k, k, k], [-k, k,-k], [ k,-k,-k], [-k,-k, k] ],
        faces: [ [0,1,3], [0,2,1], [0,3,2], [1,2,3] ]
    };
};

/**
 * @return void
 */
Solide.prototype.getCubeGeometry = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius / Math.sqrt(3);
    return {
        vertices: [
            [ k, k, k], [ k, k,-k], [-k, k,-k], [-k, k, k],
            [ k,-k, k], [ k,-k,-k], [-k,-k,-k], [-k,-k, k]
        ],
        faces: [
            [0,1,2,3], [0,4,5,1], [1,5,6,2],
            [4,7,6,5], [2,6,7,3], [0,3,7,4],
        ]
    };
};

Solide.prototype.getDodecahedronGeometry = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius;
    return {
        vertices: [
            [ 0, k, 0], [ k, 0, 0], [ 0, 0,-k],
            [-k, 0, 0], [ 0, 0, k], [ 0,-k, 0]
        ],
        faces: [
            [0,1,2], [0,2,3], [0,3,4], [0,4,1],
            [5,4,3], [5,1,4], [5,2,1], [5,3,2],
        ]
    };
};


Solide.prototype.getIcosahedronGeometryA = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius;
    var vertices = [[0,k,0]];
    var faces = [];
    var i, ang;
    var r = .3 * k;
    var y = .2;

    for ( i=0 ; i<5 ; i++ ) {
        ang = i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [0, i + 2, i + 1] );
        } else {
            faces.push( [0, 1, 5] );
        }
    }

    for ( i=0 ; i<5 ; i++ ) {
        ang = Math.PI / 5 + i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), -y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [11, i + 6, i + 7] );
        } else {
            faces.push( [11, 10, 6] );
        }
    }
    vertices.push( [0,-k,0] );

    return {
        vertices: vertices,
        faces: faces
    };
};


Solide.prototype.getIcosahedronGeometry = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius;
    var vertices = [[0,k,0]];
    var faces = [];
    var i, ang;
    var r = .9 * k;
    var y = 1 - r * Math.sqrt( 4 * Math.sin(Math.PI / 5) * Math.sin(Math.PI / 5) - 1 );

    for ( i=0 ; i<5 ; i++ ) {
        ang = i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [0, i + 2, i + 1] );
        } else {
            faces.push( [0, 1, 5] );
        }
    }

    for ( i=0 ; i<5 ; i++ ) {
        ang = Math.PI / 5 + i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), -y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [11, i + 6, i + 7] );
        } else {
            faces.push( [11, 10, 6] );
        }
    }
    vertices.push( [0,-k,0] );

    var j, a1, a2, b6, b7;
    for ( i=0 ; i<5 ; i++ ) {
        j = (i + 2) % 5;
        a1 = j + 1;
        a2 = (j + 1) % 5 + 1;
        b6 = j + 6;
        b7 = (j + 1) % 5 + 6;
        faces.push( [a1, a2, b6] );
        faces.push( [a2, b7, b6] );
    }

    return {
        vertices: vertices,
        faces: faces
    };
};


Solide.prototype.getIcosahedronGeometryB = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var k = radius;
    var vertices = [[0,k,0]];
    var faces = [];
    var i, ang;
    var r = .9 * k;
    var y = 1 - r * Math.sqrt( 4 * Math.sin(Math.PI / 5) * Math.sin(Math.PI / 5) - 1 );

    for ( i=0 ; i<5 ; i++ ) {
        ang = i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [0, i + 2, i + 1] );
        } else {
            faces.push( [0, 1, 5] );
        }
    }

    for ( i=0 ; i<5 ; i++ ) {
        ang = Math.PI / 5 + i * 2 * Math.PI / 5;
        vertices.push( [r * Math.cos( ang ), -y, r * Math.sin( ang )] );
        if (i < 4) {
            faces.push( [11, i + 6, i + 7] );
        } else {
            faces.push( [11, 10, 6] );
        }
    }
    vertices.push( [0,-k,0] );

    return {
        vertices: vertices,
        faces: faces
    };
};


/**
 * @return void
 */
Solide.prototype.createSolid = function(nbFaces) {
    var colors = [
        new THREE.Color( 0xaaffaa ),
        new THREE.Color( 0xffaaaa ),
        new THREE.Color( 0xaaaaff ),
        new THREE.Color( 0xffffaa ),
        new THREE.Color( 0xffaaff ),
        new THREE.Color( 0xaaffff )
    ];

    var mesh, opt;
    var k = 1 / Math.sqrt(3);
    if (nbFaces == 4) {
        mesh = new THREE.Group();
        opt = this.getTetrahedronGeometry();
        opt.colors = colors;
        mesh.add( this.createMesh( opt ) );
        opt = this.getCubeGeometry();
        opt.solid = false;
        this._blinker = this.createMesh( opt );
        mesh.add( this._blinker );
    }
    else if (nbFaces == 6) {
        mesh = new THREE.Group();
        opt = this.getCubeGeometry();
        opt.colors = colors;
        mesh.add( this.createMesh( opt ) );
    }
    else if (nbFaces == 8) {
        mesh = new THREE.Group();
        opt = this.getDodecahedronGeometry();
        opt.colors = colors;
        opt.nbColors = 4;
        mesh.add( this.createMesh( opt ) );
        opt = this.getCubeGeometry(.59);
        opt.solid = false;
        opt.colors = colors;
        this._blinker = this.createMesh( opt );
        mesh.add( this._blinker );        
    }
    else if (nbFaces == '20a') {
        mesh = new THREE.Group();
        opt = this.getIcosahedronGeometryA();
        opt.colors = colors;
        opt.nbColors = 5;
        mesh.add( this.createMesh( opt ) );
    }
    else if (nbFaces == '20b') {
        mesh = new THREE.Group();
        opt = this.getIcosahedronGeometryB();
        opt.colors = colors;
        opt.nbColors = 5;
        mesh.add( this.createMesh( opt ) );
    }
    else if (nbFaces == 20) {
        mesh = new THREE.Group();
        opt = this.getIcosahedronGeometry();
        opt.colors = colors;
        opt.nbColors = 5;
        mesh.add( this.createMesh( opt ) );
    }

    return mesh;
};


Solide.create = function() {
    return new Solide();
};
module.exports = Solide;

