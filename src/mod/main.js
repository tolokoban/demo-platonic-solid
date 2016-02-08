var Widget = require("wdg");
var PlatonSolide = require("platon.solide");
var PlatonDodeca = require("platon.dodeca1");


var backgroundImage = new Image();
backgroundImage.src = "css/main/back.jpg";
backgroundImage.onload = start;


var text = "Geometers have studied the mathematical beauty and symmetry of the Platonic solids for thousands of years. They are named for the ancient Greek philosopher Plato who theorized in his dialogue, the Timaeus, that the classical elements were made of these regular solids.";
var cursor = 0;


function start() {
    var body = new Widget({element: document.body});
    var main = new Widget({id: 'main'});
    body.addClass("main");

    var W = Math.min(window.innerWidth, window.innerHeight) / 5;
    var H = W;

    var solids = [
        new PlatonSolide({faces: 4, width: W, height: H}),
        new PlatonSolide({faces: 6, width: W, height: H}),
        new PlatonSolide({faces: 8, width: W, height: H}),
        new PlatonSolide({faces: 20, width: W, height: H}),
        new PlatonDodeca({width: Math.floor( W * 1.5 ), height: Math.floor( H * 1.5 )})
    ];

    solids.forEach(function (solid) {
        solid.css({
            margin: (-H / 2) + "px " + (-W / 2) + "px"
        });
        body.append( solid );
    });

    main.clear();

    var letters = [];
    var letter;
    var i;

    for ( i=0 ; i<text.length ; i++ ) {
        letter = Widget.tag('span', 'hide').text( text.charAt( i ) );
        letters.push( letter );
        main.append( letter );
    }

    cursor = 0;
    var nextChar = function() {
        letters[cursor].removeClass( 'hide' );
        cursor++;
        setTimeout(function() {
            if ( cursor < letters.length ) {
                nextChar();
            } else {
                wetTimeout(function() {
                    main.append( Widget.div('soon').text( "Coming soon: the Icosahedron!" ));
                }, 6000);
            }
        }, 40);
    };

    nextChar();
}
