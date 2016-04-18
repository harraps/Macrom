
/* QUATERNION */
class QuaternionInPin extends InPin {
    
    public value : Sup.Math.Quaternion;
    
    public update() {
        super.update();
        // if the there is no rotation, the wire is off
        this.setWire(
            !QuaternionInPin.isRotationNull(this.value)
        );
    }
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof QuaternionOutPin ){
            super.connect(outpin);
        }
    }
    private static isRotationNull( quat : Sup.Math.Quaternion ) : boolean{
        // if the quaternion is null
        if( !quat ) return true;
        // if x, y and z are null
        return !(quat.x || quat.y || quat.z);
    }
}
class QuaternionOutPin extends OutPin {
    public value : Sup.Math.Quaternion;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof QuaternionInPin ){
            super.connect(inpin);
        }
    }
}

/* REGISTER */
Sup.registerBehavior(QuaternionInPin);
Sup.registerBehavior(QuaternionOutPin);
