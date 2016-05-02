class NumberInputBlock extends AbstractBlock {
    
    public value : number = 0;
    
    public update(){
        this.labels["LABEL"].setText(this.value);
    }
    public interact() {
        // TODO
    }
    public getValue() : number{
        return this.value;
    }
    public setValue( value : number ){
        this.value = value;
    }
}
class RandomBlock extends AbstractBlock{
    
    protected value    : number  = Math.random();
    private wasToggled : boolean = false;
    
    public update(){
        // if the pin A is true
        if( this.inputs["IN"].value ){
            // if the pin has just changed of value, we toggle the value
            if(!this.wasToggled) this.value = Math.random();
            // the value has already been toggled
            this.wasToggled = true;
        }else{
            // the pin is now false, we can register the next toggle
            this.wasToggled = false;
        }
    }
    public interact(){
        this.value = Math.random();
    }
    public getValue() : number{
        return this.value;
    }
}
class PI_Block extends AbstractBlock{
    
    protected mod : number = 1;
    
    public getValue() : number{
        return Math.PI*this.mod;
    }
    public interact(){
        this.mod += 0.25;
        if(this.mod >= 2) this.mod = 0;
        let text : string;
        switch(this.mod){
            case 0    : text="0"    ; break;
            case 0.25 : text="PI/4" ; break;
            case 0.5  : text="PI/2" ; break;
            case 0.75 : text="3PI/4"; break;
            case 1    : text="PI"   ; break;
            case 1.25 : text="5PI/4"; break;
            case 1.5  : text="3PI/2"; break;
            case 1.75 : text="7PI/4"; break;
        }
        if(this.labels["LABEL"]) this.labels["LABEL"].setText(text);
    }
}

/* REGISTER */
Sup.registerBehavior(NumberInputBlock);
Sup.registerBehavior(RandomBlock);
Sup.registerBehavior(PI_Block);
