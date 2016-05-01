/*declare let window;
declare let THREE;
THREE = window.SupEngine.THREE;*/

abstract class Game {
    
    public static input   : InputManager;
    public static player  : Player;
    public static board   : Board;
    private static colors : Sup.Color[];
    
    public static start(){
        Game.input  = new InputManager();
        Game.colors = []; // contains the color we have defined to avoid duplications
        Game.colors["black" ] = new Sup.Color(0x000000); // we add the color black to the array
        Game.colors["white" ] = new Sup.Color(0xFFFFFF);
        Game.colors["yellow"] = new Sup.Color(0xFFFF00);
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

Game.start();
Game.input.resetKeyboard("AZERTY");