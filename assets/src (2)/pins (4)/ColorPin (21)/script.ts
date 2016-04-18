
/* COLOR */
class ColorInPin extends InPin {
    
    public value : Sup.Color;
    
    public update() {
        super.update();
        // if the value is null, the wire is off
        if( !this.value ){
            this.setWire(false);
        }else{
            this.colorHigh = this.value;
            // if the color is not black, the wire is on
            this.setWire(
                this.value.getHex() != Game.getColor("black").getHex()
            );
        }
    }
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof ColorOutPin ){
            super.connect(outpin);
        }
    }
}
class ColorOutPin extends OutPin {
    public value : Sup.Color;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof ColorInPin ){
            super.connect(inpin);
        }
    }
}

/* REGISTER */
Sup.registerBehavior(ColorInPin);
Sup.registerBehavior(ColorOutPin);
