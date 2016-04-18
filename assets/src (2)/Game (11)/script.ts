/*declare let window;
declare let THREE;
THREE = window.SupEngine.THREE;*/

abstract class Game {
    
    public static ticks     : number; // define the length of a ticks in frames
    public static input     : InputManager;
    public static player    : Player;
    public static inpins    : Sup.Actor[];
    public static outpins   : Sup.Actor[];
    public static interacts : Sup.Actor[];
    
    private static colors : Sup.Color[];
    
    public static start(){
        Game.ticks     = 6; // a ticks is 100ms 
        Game.input     = new InputManager();
        Game.inpins    = []; // contains all of the  inpins of the game
        Game.outpins   = []; // contains all of the outpins of the game
        Game.interacts = []; // contains all of the interactible objects of the game
        Game.colors    = []; // contains the color we have defined to avoid duplications
        Game.colors["black"] = new Sup.Color(0); // we add the color black to the array 
    }
    
    public static getColor( colorDef : string ) : Sup.Color{
        // if our color already exists in the array, we return it
        if( Game.colors[colorDef] ) return Game.colors[colorDef];
        // otherwise, we have to create it, and add it to the array
        let color = new Sup.Color(parseInt("0x"+colorDef)); // we create a black
        // we add the color to the list so we can reuse it
        Game.colors[colorDef] = color;
        return color;
    }
    
}

let Util = {
    TAU    : Math.PI*2,
    halfPI : Math.PI*0.5
};

Game.start();
Game.input.resetKeyboard("AZERTY");