"use strict";
var TreeCanvas = require("three.canvas");
var Rotator = require("three.rotator");


/**
 * @example
 * var Dodeca1 = require("platon.dodeca1");
 * var instance = new Dodeca1(opt);
 * @class Dodeca1
 */
var Dodeca1 = function(options) {
    if (typeof options === 'undefined') options = {};
    if (typeof options.faces === 'undefined') options.faces = 4;
    if (typeof options.width === 'undefined') options.width = 280;
    if (typeof options.height === 'undefined') options.height = 280;

    TreeCanvas.call(this, {width: options.width, height: options.height});
    this.addClass("platon-dodeca1");

    var grp = new THREE.Group();

    grp.add( this.createPentagon() );
    this.addChildren( grp );

    this.camera.position.z = 7;

    this.scene.add( grp );
    this._rotator = new Rotator( grp );

    var light = new THREE.HemisphereLight( 0xcceeff, 0x990000, 3.6 ); // soft white light
    var light1 = new THREE.DirectionalLight( 0x997777, 5 );
    var light2 = new THREE.DirectionalLight( 0x777799, 2 );
    light1.position.set(43,13,5);
    light2.position.set(-20,5,1);

    this.scene.add( light1 );
    this.scene.add( light2 );
    this.scene.add( light );

    this.start();

    this.css('float', 'right');
};

// Extension of Widget.
Dodeca1.prototype = Object.create(TreeCanvas.prototype);
Dodeca1.prototype.constructor = Dodeca1;

/**
 * @return void
 */
Dodeca1.prototype.onRender = function(time, delta) {
    TreeCanvas.prototype.onRender.call( this, time, delta );

    this._rotator.rotate( time );

    this.pentagons.forEach(function (pentagon, idx) {
        var t = time + 500 * idx;
        var threshold = 1.095;
        var bound = .25;
        var alpha = Math.cos(t / 3600);
        if (alpha > bound) {
            alpha = threshold;
        }
        else if (alpha < -bound) {
            alpha = -threshold;
        }
        else {
            alpha = threshold * alpha / bound;
        }
        pentagon.rotation.y = alpha;
    });

    
};


/**
 * @return void
 */
Dodeca1.prototype.createPentagon = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var vertices = [];
    var face = [];
    var angle;
    var i;
    for( i=0 ; i<5 ; i++ ) {
        angle = i * 2 * Math.PI / 5;
        vertices.push([
            radius * Math.cos( angle ),
            radius * Math.sin( angle ),
            0
        ]);
        face.push( i );
    }
    return this.createMesh({
        vertices: vertices,
        faces: [face],
        doublesided: true
    });
};


Dodeca1.prototype.createPentagon2 = function(radius) {
    if (typeof radius === 'undefined') radius = 1;

    var angle = 4 * Math.PI / 5;
    var dx = radius * Math.cos( angle );
    var dy = radius * Math.sin( angle );
    var vertices = [];
    var face = [];
    var i;
    for( i=0 ; i<5 ; i++ ) {
        angle = i * 2 * Math.PI / 5;
        vertices.push([
            radius * Math.cos( angle ) - dx,
            radius * Math.sin( angle ) - dy,
            0
        ]);
        face.push( i );
    }
    return this.createMesh({
        vertices: vertices,
        faces: [face],
        doublesided: true
    });
};

/**
 * @return void
 */
Dodeca1.prototype.addChildren = function(parent, radius) {
    if (typeof radius === 'undefined') radius = 1;

    var angle;
    var x;
    var y;
    var pentagons = [];
    var pentagon;
    var grp;
    var i;
    for( i=0 ; i<5 ; i++ ) {
        angle = i * 2 * Math.PI / 5;
        x = radius * Math.cos( angle );
        y = radius * Math.sin( angle );
        pentagon = this.createPentagon2( radius );
        pentagons.push( pentagon );
        grp = new THREE.Group();
        grp.add( pentagon );
        grp.position.x = x;
        grp.position.y = y;
        grp.rotation.z = angle - 0.2 * Math.PI;
        parent.add( grp );
    }
    this.pentagons = pentagons;
};


Dodeca1.create = function(opt) {
    return new Dodeca1(opt);
};
module.exports = Dodeca1;
