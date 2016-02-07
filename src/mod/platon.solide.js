"use strict";
var TreeCanvas = require("three.canvas");
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


    TreeCanvas.call(this, {width: options.width, height: options.height});
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
Solide.prototype = Object.create(TreeCanvas.prototype);
Solide.prototype.constructor = Solide;

/**
 * @return void
 */
Solide.prototype.onRender = function(time, delta) {
    TreeCanvas.prototype.onRender.call( this, time, delta );

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

    return mesh;
};


Solide.create = function() {
    return new Solide();
};
module.exports = Solide;

