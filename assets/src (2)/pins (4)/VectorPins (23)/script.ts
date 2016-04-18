abstract class AbstractVectorInPin extends InPin {
    
    public update(){
        super.update();
        // if the vector is null, the wire is off
        this.setWire(
            !AbstractVectorInPin.isVectorNull(this.value)
        );
    }
    protected static isVectorNull( vector : any ){
        // if vector is null
        if(!vector) return true;
        // if x, y and z are null
        return !( vector.x || vector.y || vector.z );
    }
}

/* VECTOR 2D */
class Vector2DInPin extends AbstractVectorInPin {
    public value : Sup.Math.Vector2;
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof Vector2DOutPin ){
            super.connect(outpin);
        }
    }
}
class Vector2DOutPin extends OutPin {
    public value : Sup.Math.Vector2;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof Vector2DInPin ){
            super.connect(inpin);
        }
    }
}

/* VECTOR 3D */
class Vector3DInPin extends AbstractVectorInPin {
    public value : Sup.Math.Vector3;
    public connect( outpin : OutPin ){
        // if the outpin is of the right type
        if( outpin instanceof Vector3DOutPin ){
            super.connect(outpin);
        }
    }
}
class Vector3DOutPin extends OutPin {
    public value : Sup.Math.Vector3;
    public connect( inpin : InPin ){
        // if the inpin is of the right type
        if( inpin instanceof Vector3DInPin ){
            super.connect(inpin);
        }
    }
}

/* REGISTER */
Sup.registerBehavior( Vector2DInPin  );
Sup.registerBehavior( Vector3DInPin  );
Sup.registerBehavior( Vector2DOutPin );
Sup.registerBehavior( Vector3DOutPin );