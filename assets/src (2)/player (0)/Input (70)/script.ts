interface IInput {
    getMove     () : Sup.Math.XYZ;
    getLook     () : Sup.Math.XY;
    getCycle    () : number;
    getNumerical() : number;
    getInventory() : boolean;
    getSwitch   () : boolean;
    getSelect   () : boolean;
    getCommand  () : string;
}

class KeyboardInput implements IInput {
    public getMove() : Sup.Math.XYZ{
        let move = {x:0,y:0,z:0}
        if(Game.input.isInputDown("moveF")) ++move.z;
        if(Game.input.isInputDown("moveB")) --move.z;
        if(Game.input.isInputDown("moveL")) --move.x;
        if(Game.input.isInputDown("moveR")) ++move.x;
        if(Game.input.isInputDown("moveU")) ++move.y;
        if(Game.input.isInputDown("moveD")) --move.y;
        return move;
    }
    public getLook() : Sup.Math.XY{
        let look =  Sup.Input.getMouseDelta() //{x:0,y:0};
        return look;
    }
    public getCycle() : number{
        let cycle = 0;
        // we recover the movement of the mouse wheel
        if(Sup.Input.isMouseButtonDown(5)) ++cycle;
        if(Sup.Input.isMouseButtonDown(6)) --cycle;
        return cycle;
    }
    public getNumerical() : number{
        // we test each numerical key : [1,2,3,4,5,6,7,8,9,0]
        for(let i=0; i<Inventory.MAX; ++i){
            // if a key is pressed, we return it, we skip the others
            if(Sup.Input.isKeyDown(""+i)) return i;
        }
        // no numerical key was pressed
        return -1;
    }
    public getInventory() : boolean{
        return Game.input.wasInputJustPressed("inventory");
    }
    public getSwitch() : boolean{
        return Game.input.wasInputJustPressed("switch");
    }
    public getSelect() : boolean{
        return Game.input.isInputDown("select");
    }
    public getCommand() : string{
        if(Game.input.wasInputJustPressed("cmdCut"  )) return "cut";
        if(Game.input.wasInputJustPressed("cmdCopy" )) return "copy";
        if(Game.input.wasInputJustPressed("cmdPaste")) return "paste";
        return null;
    }
}
