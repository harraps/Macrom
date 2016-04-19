interface IPath{
    name: string,
    path: string,
    subs: IPath[] // if null, it's a prefab path
}
class Inventory {
    
    // we define the block available to use
    public static BLOCKS : IPath;
    
    public static initBLOCKS() {
        // we recover the hierachy of blocks defined in the "BLOCKS" directory
        Inventory.BLOCKS = Inventory.generateIPath("BLOCKS");
        //Sup.log(Inventory.BLOCKS);
    }
    private static generateIPath( path : string ) : IPath{
        // we recover the asset at the given path
        let folder : any = Sup.get(path);
        // if the asset is not a folder or a scene, it's of no use
        if(folder.type != "folder" && folder.type != "scene") return null;
        
        let subpaths = null;
        // if the asset is of type folder, there is other assets inside
        if(folder.type == "folder"){
            // we want to store sub paths
            subpaths = [];
            for( let child of folder.children ){
                // we recover the sub asset
                let sub = Inventory.generateIPath(path+"/"+child);
                // if sub is not null, we add it to the list
                if(sub) subpaths[subpaths.length] = sub;
            }
        }
        return {
            name: folder.name,
            path: path,
            subs: subpaths
        };
    }
    
    public static MAX : number  = 10;
    
    protected prefabs : IPath[] = [];
    protected pointed : number  = 0;
    
    public setPrefab( id : number, path : IPath ){
        // if the id is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.prefabs[id] = path;
        }
    }
    public previous(){
        --this.pointed;
        // if we're out of range, we return to the max value (9 <- 0)
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
    }
    public next(){
        ++this.pointed;
        // if we're out of range, we return to the min value (9 -> 0)
        if(this.pointed >= Inventory.MAX) this.pointed = 0;
    }
    public cycle( direction : number ){
        this.pointed += direction;
        // we keep the value within the range [0-9]
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
        else if(this.pointed >= Inventory.MAX) this.pointed = 0;
    }
    public setCurrent( id : number ){
        // if the value is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.pointed = id;
        }
    }
    public getCurrent() : IPath{
        return this.prefabs[this.pointed];
    }
    
}
Inventory.initBLOCKS();