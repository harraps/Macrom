class LogicGate1 extends AbstractBlock{
    private static buf( value:boolean ):boolean{ return  value; }
    private static not( value:boolean ):boolean{ return !value; }
    
    protected mod : boolean  = false; // modifier is boolean here
    protected fun : Function = LogicGate1.buf;
    
    public getValue() : boolean{
        return this.fun(this.inputs["IN"]);
    }
    public interact(){
        this.mod = !this.mod;
        this.fun = this.mod ? LogicGate1.not : LogicGate1.buf;
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(this.mod ? "NOT" : "BUF");
    }
}
class LogicGate2 extends AbstractBlock{
    private static  and( a:boolean, b:boolean ){ return   a && b;    }
    private static   or( a:boolean, b:boolean ){ return   a || b;    }
    private static  xor( a:boolean, b:boolean ){ return   a ?! b:b;  }
    private static nand( a:boolean, b:boolean ){ return !(a && b);   }
    private static  nor( a:boolean, b:boolean ){ return !(a || b);   }
    private static xnor( a:boolean, b:boolean ){ return !(a ?! b:b); }
    
    protected mod : number   = 0;
    protected fun : Function = LogicGate2.and;
    
    public getValue(){
        return this.fun(this.inputs["A"],this.inputs["B"]);
    }
    public interact(){
        ++this.mod;
        // if we bypass the max value
        if(this.mod >= 6) this.mod = 0;
        let text : string;
        switch(this.mod){
            case 0 : this.fun=LogicGate2. and; text= "AND"; break;
            case 1 : this.fun=LogicGate2.  or; text=  "OR"; break;
            case 2 : this.fun=LogicGate2. xor; text= "XOR"; break;
            case 3 : this.fun=LogicGate2.nand; text="NAND"; break;
            case 4 : this.fun=LogicGate2. nor; text= "NOR"; break;
            case 5 : this.fun=LogicGate2.xnor; text="XNOR"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}

class ToggleLatch extends AbstractBlock{
    
    protected value : boolean;
    private wasToggled : boolean;
    
    public update(){
        // if the pin A is true
        if( this.inputs["IN"].value ){
            // if the pin has just changed of value, we toggle the value
            if(!this.wasToggled) this.value = !this.value;
            // the value has already been toggled
            this.wasToggled = true;
        }else{
            // the pin is now false, we can register the next toggle
            this.wasToggled = false;
        }
    }
    public interact(){
        this.value = !this.value;
    }
    public getValue() : boolean{
        return this.value;
    }
}

class RSnorLatch extends AbstractBlock{
    
    protected value : boolean;
    
    public update(){
        // if IN_A is true, the value is set to true
        if( this.inputs["R"].value ) this.value = true;
        // if IN_B is true, the value is set to false
        else if( this.inputs["S"].value ) this.value = false;
    }
    public interact(){
        this.value = !this.value;
    }
    public getValue( pin : BoolOutPin ) : boolean{
        // if the pin calling the value is OUT_A, we return the value as is
        if( pin == this.outputs["Q"] ) return this.value;
        // if it's not OUT_A, we return NOT value
        return !this.value;
    }
}

/* REGISTER */
Sup.registerBehavior(LogicGate1);
Sup.registerBehavior(LogicGate2);

Sup.registerBehavior(ToggleLatch);
Sup.registerBehavior( RSnorLatch);


