abstract class BasicInPin extends InPin{
    public update(){
        super.update();
        // if null, false, 0 or "" the wire is off
        this.setWire(this.value);
    }
}

/* BOOLEAN */
class BoolInPin extends BasicInPin {
    public value : boolean; // we set the type of the value to boolean
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof BoolOutPin ) super.connect(outpin);
    }
}
class BoolOutPin extends OutPin {
    public value : boolean; // we set the type of the value to boolean
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof BoolInPin ) super.connect(inpin);
    }
}

/* NUMBER */
class NumberInPin extends BasicInPin {
    public value : number;
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof NumberOutPin ) super.connect(outpin);
    }
}
class NumberOutPin extends OutPin {
    public value : number;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof NumberInPin ) super.connect(inpin);
    }
}

/* TEXT */
class TextInPin extends BasicInPin {
    public value : string;
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof TextOutPin ) super.connect(outpin);
    }
}
class TextOutPin extends OutPin {
    public value : string;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof TextInPin ) super.connect(inpin);
    }
}

/* REGISTER */
Sup.registerBehavior( BoolInPin   );
Sup.registerBehavior( BoolOutPin  );
Sup.registerBehavior( NumberInPin );
Sup.registerBehavior( NumberOutPin);
Sup.registerBehavior( TextInPin   );
Sup.registerBehavior( TextOutPin  );
