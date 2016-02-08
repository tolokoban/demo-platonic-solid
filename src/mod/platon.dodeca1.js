"use strict";
var ThreeCanvas = require("three.canvas");
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

    this._params1 = [[0,1], [0,1], [0,1], [0,1], [0,1]];
    this._params2 = [[0,1], [0,1], [0,1], [0,1], [0,1]];
    
    ThreeCanvas.call(this, {width: options.width, height: options.height});
    this.addClass("platon-dodeca1");

    var grp = new THREE.Group();

    grp.add( this.createPentagon() );
    this.addChildren( grp );

    this.camera.position.z = 9;

    this.scene.add( grp );
    this.root = grp;
    this._rotator = new Rotator(grp);

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
Dodeca1.prototype = Object.create(ThreeCanvas.prototype);
Dodeca1.prototype.constructor = Dodeca1;

/**
 * @return void
 */
Dodeca1.prototype.onRender = function(time, delta) {
    //this.root.rotation.set(-.3,.1,0);
    //return;
    this._rotator.rotate( time * .3 );

    var threshold = 1.1;
    
    var pentagons2 = this.pentagons2;
    var Ta = 5000;
    var Tb = 3000;
    var Tc = 5000;
    var Td = 3000;
    time %= Ta + Tb + Tc + Td;

    var step = 3;
    if ( time < Ta ) {
        step = 0;
    }
    else if ( time < Ta + Tb ) {
        step = 1;
    }
    else if ( time < Ta + Tb + Tc ) {
        step = 2;
    }

    console.info("[platon.dodeca1] step=...", step);
    if ( typeof this._lastStep === 'undefined' || this._lastStep > step ) {
        // One more loop. Let's initialize random attributes.
        this._params1.forEach(function (param) {
            var a = Math.random() * .7;
            var b = a + .3 + (.7 - a) * Math.random();
            param[0] = a;
            param[1] = b;
        });
        this._params2.forEach(function (param) {
            var a = Math.random() * .7;
            var b = a + .3 + (.7 - a) * Math.random();
            param[0] = a;
            param[1] = b;
        });
    }
        
    this.pentagons.forEach(function (pentagon, idx) {
        var t = time;
        var ang1, ang2;
        var p1 = this._params1[idx];
        var p2 = this._params2[idx];

        var endA = Ta + p1[0] * Tb;
        var endB = Ta + p1[1] * Tb;
        var endC = Ta + Tb + Tc + p1[0] * Td;
        var endD = Ta + Tb + Tc + p1[1] * Td;

        if (t < endA) {
            ang1 = threshold;
        }
        else if (t < endB) {
            ang1 = threshold - 2 * threshold * (t - endA) / (endB - endA);
        }
        else if (t < endC) {
            ang1 = -threshold;
        }
        else if (t < endD) {
            ang1 = -threshold + 2 * threshold * (t - endC) / (endD - endC);
        }
        else {
            ang1 = threshold;
        }
        
        endA = Ta + p2[0] * Tb;
        endB = Ta + p2[1] * Tb;
        endC = Ta + Tb + Tc + p2[0] * Td;
        endD = Ta + Tb + Tc + p2[1] * Td;

        if (t < endA) {
            ang2 = threshold;
        }
        else if (t < endB) {
            ang2 = threshold - 2 * threshold * (t - endA) / (endB - endA);
        }
        else if (t < endC) {
            ang2 = -threshold;
        }
        else if (t < endD) {
            ang2 = -threshold + 2 * threshold * (t - endC) / (endD - endC);
        }
        else {
            ang2 = threshold;
        }
        
        pentagon.rotation.y = ang1;
        var pentagon2 = pentagons2[idx];
        pentagon2.rotation.y = ang2;
    }, this);

    this._lastStep = this._step;
    this._step = step;
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


Dodeca1.prototype.createPentagon2 = function(radius, material) {
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
    var grp = new THREE.Group();

    grp.add(
        this.createMesh({
            vertices: vertices,
            faces: [face],
            doublesided: true,
            material: material
        })
    );
    // grp.add( this.createAxis() );
    return grp;
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
    var pentagons2 = [];
    var container;
    var pentagon;
    var grp;
    var pentagon2;
    var grp2;
    var i;
    var R = radius * 2 * Math.cos( 0.3 * Math.PI );
    var X = R * Math.cos( Math.PI / 10 );
    var Y = R * Math.sin( Math.PI / 10 );

    // grp -- container -- pentagon
    //                  \- grp2 -- pentagon2
    for( i=0 ; i<5 ; i++ ) {
        container = new THREE.Group();

        angle = i * 2 * Math.PI / 5;
        x = radius * Math.cos( angle );
        y = radius * Math.sin( angle );
        pentagon = this.createPentagon2( radius );
        pentagons.push( container );
        container.add( pentagon );
        grp = new THREE.Group();
        grp.add( container );
        grp.position.x = x;
        grp.position.y = y;
        grp.rotation.z = angle - 0.2 * Math.PI;

        pentagon2 = this.createPentagon2( radius );
        pentagons2.push( pentagon2 );
        grp2 = new THREE.Group();
        grp2.add( pentagon2 );
        grp2.position.x = X;
        grp2.position.y = Y;
        grp2.rotation.z = 0.2 * Math.PI;
        container.add( grp2 );

        parent.add( grp );
    }
    this.pentagons = pentagons;
    this.pentagons2 = pentagons2;
};


Dodeca1.create = function(opt) {
    return new Dodeca1(opt);
};
module.exports = Dodeca1;
