interface IGroup{
    name  : string,
    paths : IPath[]
}
interface IPath{
    name : string,
    path : string
}
interface IhudElement{
    parent   : Sup.Actor;
    children : Sup.Actor[];
}
class Inventory {
    
    // we define the block available to use
    public static BLOCKS : IGroup[];
    
    public static MAX : number  = 10;
    
    public static initBLOCKS() {
        Inventory.BLOCKS = [];
        let root_name = "BLOCKS";
        // we recover the hierachy of blocks defined in the "BLOCKS" directory
        let root : any = Sup.get(root_name);
        for( let group_name of root.children ){
            let paths = [];
            let group : any = Sup.get(root_name+"/"+group_name);
            if(group.type == "folder"){
                for( let block_name of group.children ){
                    paths.push({name : block_name, path : root_name+"/"+group_name+"/"+block_name});
                }
                Inventory.BLOCKS.push({name: group_name, paths: paths});
            }
        }
    }
    
    public player : Player;
    
    
    
    // the list of blocks the player can place in the world
    public prefabs : IPath[] = [];
    public pointed : number  = 1; // selected block (1 is first, 0 is last)
    // define which group of blocks to display in the menu
    public currentGroup  : number = 0;
      
    public constructor(player : Player){
        this.player = player;
    }
    
    public setPrefab( id : number, path : IPath ){
        // if the id is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.prefabs[id] = path;
            
            let label = ""+id+". ";  // id of the block
            label += path ? path.name : ""; // if path not null, display block name
            // we display the block name
            this.player.hud.palette.children[id].textRenderer.setText(label);
        }
    }
    
    public updatePointed(){
        this.cycle     (this.player.input.getCycle    ());
        this.setCurrent(this.player.input.getNumerical());
    }
    public previous(){
        this.player.hud.setColorCurrent("white");
        --this.pointed;
        // if we're out of range, we return to the max value (9 <- 0)
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
        this.player.hud.setColorCurrent("yellow");
    }
    public next(){
        this.player.hud.setColorCurrent("white");
        ++this.pointed;
        // if we're out of range, we return to the min value (9 -> 0)
        if(this.pointed >= Inventory.MAX) this.pointed = 0;
        this.player.hud.setColorCurrent("yellow");
    }
    public cycle( direction : number ){
        this.player.hud.setColorCurrent("white");
        this.pointed += direction;
        // we keep the value within the range [0-9]
        if(this.pointed < 0) this.pointed = Inventory.MAX-1;
        else if(this.pointed >= Inventory.MAX) this.pointed = 0;
        this.player.hud.setColorCurrent("yellow");
    }
    public setCurrent( id : number ){
        // if the value is within the range [0-9]
        if( 0 <= id && id < Inventory.MAX ){
            this.player.hud.setColorCurrent("white");
            this.pointed = id;
            this.player.hud.setColorCurrent("yellow");
        }
    }
    public getCurrent() : IPath{
        return this.prefabs[this.pointed];
    }
    
}
Inventory.initBLOCKS();