class ComplexInputManager {
    public static names : string[] = [
        "moveForward","moveBackward", // Z axis
        "moveLeft","moveRight",       // X axis
        "moveUp","moveDown",          // Y axis
        
        "lookUp","lookDown",    // Y axis
        "lookLeft","lookRight", // X axis
        
        "cycleUp","cycleDown", // X axis
        
        "inventory", // display inventory to choose blocks
        "connect",   // allow to connect connectors
        "destroy",   // destroy the pointed block
        "build",     // build block at pointed position
        "use",       // use pointed object
        
        "select",   // create selection zone at pointed block
        "unselect", // delete selection zone
        "cmdCut",   // cut  selection to clipboard
        "cmdCopy",  // copy selection to clipboard
        "cmdPaste", // paste the content of clipboard
    ];

    public mouse : number[];
    public keys  : string[];
    public pad   : number[];
    
    public constructor( keyLayout? : string, padLayout? : string ){
        this.mouse = [];
        this.keys  = [];
        this.pad   = [];
        
        this.resetKeyboard(keyLayout);
        this.resetGamepad (padLayout);
    }

    // return true if the input is down wherever it is a mouse button or one of the two possible keys
    public isInputDown( input : string ) : boolean{
        // we check each array with the right function
        if( ComplexInputManager.checkInput(this.mouse, Sup.Input.isMouseButtonDown,   input) ) return true;
        if( ComplexInputManager.checkInput(this.keys,  Sup.Input.isKeyDown,           input) ) return true;
        if( ComplexInputManager.checkInput(this.pad,   Sup.Input.isGamepadButtonDown, input) ) return true;
        return false;
    }
    
    // return true if the input was just pressed wherever it is a mouse button or one of the two possible keys
    public wasInputJustPressed( input : string ) : boolean{
        // we check each array with the right function
        if( ComplexInputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustPressed,   input) ) return true;
        if( ComplexInputManager.checkInput(this.keys,  Sup.Input.wasKeyJustPressed,           input) ) return true;
        if( ComplexInputManager.checkInput(this.pad,   Sup.Input.wasGamepadButtonJustPressed, input) ) return true;
        return false;
    }
    
    // return true if the input was just released wherever it is a mouse button or one of the two possible keys
    public wasInputJustReleased( input : string ) : boolean{
        // we check each array with the right function
        if( ComplexInputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustReleased,   input) ) return true;
        if( ComplexInputManager.checkInput(this.keys,  Sup.Input.wasKeyJustReleased,           input) ) return true;
        if( ComplexInputManager.checkInput(this.pad,   Sup.Input.wasGamepadButtonJustReleased, input) ) return true;
        return false;
    }
    
    // check if input is set and call the function on the input
    private static checkInput( array : number[]|string[], call : Function, input : string ) : boolean{
        if( array[input] != null ){
            return call( array[input] );
        }
    }
    
    public resetKeyboard( layout? : string ){
        this.keys ["moveForward" ] = "W";
        this.keys ["moveBackward"] = "S";
        this.keys ["moveLeft"    ] = "A";
        this.keys ["moveRight"   ] = "D";
        this.keys ["moveUp"      ] = "SPACE";
        this.keys ["moveDown"    ] = "SHIFT";
        this.mouse["cycleUp"     ] = 5;
        this.mouse["cycleDown"   ] = 6;
        
        this.keys ["inventory"] = "TAB";
        this.mouse["destroy"  ] = 0;
        this.mouse["build"    ] = 1;
        this.keys ["connect"  ] = "Q";
        this.keys ["use"      ] = "E";
        
        this.keys["select"  ] = "CTRL";
        this.keys["unselect"] = "ALT";
        this.keys["cmdCut"  ] = "X";
        this.keys["cmdCopy" ] = "C";
        this.keys["cmdPaste"] = "V";
        
        switch( layout ){
            case "QWERTY" : // english
                break;
            case "QWERTZ" : // german
                break;
            case "AZERTY" : // french
                this.keys["moveForward"] = "Z";
                this.keys["moveLeft"   ] = "Q";
                this.keys["connect"    ] = "A";
                break;
            case "QZERTY" : // italian
                this.keys["moveForward"] = "Z";
                break;
        }
    }
    public resetGamepad( layout? : string ){
        
    }
}
