class InputManager {
    public static names : string[] = [
        "moveF","moveB", // Z axis
        "moveL","moveR", // X axis
        "moveU","moveD", // Y axis
        
        "inventory", // display inventory to choose blocks
        "switch",    // allow to switch between build mode and interact mode
        
        "select",   // create selection zone at pointed block
        "cmdCut",   // cut  selection to clipboard
        "cmdCopy",  // copy selection to clipboard
        "cmdPaste", // paste the content of clipboard
    ];
    public keys  : string[];
    
    public constructor( keyLayout? : string, padLayout? : string ){
        this.keys  = [];
        this.resetKeyboard(keyLayout);
    }

    // return true if the input is down wherever it is a mouse button or one of the two possible keys
    public isInputDown( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.keys, Sup.Input.isKeyDown, input) ) return true;
        return false;
    }
    
    // return true if the input was just pressed wherever it is a mouse button or one of the two possible keys
    public wasInputJustPressed( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.keys, Sup.Input.wasKeyJustPressed, input) ) return true;
        return false;
    }
    
    // return true if the input was just released wherever it is a mouse button or one of the two possible keys
    public wasInputJustReleased( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.keys, Sup.Input.wasKeyJustReleased, input) ) return true;
        return false;
    }
    
    // check if input is set and call the function on the input
    private static checkInput( array : number[]|string[], call : Function, input : string ) : boolean{
        if( array[input] != null ){
            return call( array[input] );
        }
    }
    
    public resetKeyboard( layout? : string ){
        this.keys ["moveF"] = "W";
        this.keys ["moveB"] = "S";
        this.keys ["moveL"] = "A";
        this.keys ["moveR"] = "D";
        this.keys ["moveU"] = "SPACE";
        this.keys ["moveD"] = "SHIFT";
        
        this.keys ["inventory"] = "TAB";
        this.keys ["switch"   ] = "Q";
        
        this.keys["select"  ] = "CTRL";
        this.keys["cmdCut"  ] = "X";
        this.keys["cmdCopy" ] = "C";
        this.keys["cmdPaste"] = "V";
        
        switch( layout ){
            case "QWERTY" : // english
                break;
            case "QWERTZ" : // german
                break;
            case "AZERTY" : // french
                this.keys["moveF" ] = "Z";
                this.keys["moveL" ] = "Q";
                this.keys["switch"] = "A";
                break;
            case "QZERTY" : // italian
                this.keys["moveF"] = "Z";
                break;
        }
    }
}
