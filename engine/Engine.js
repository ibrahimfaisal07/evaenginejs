import { Collider, PhysicsBody } from "./lib/physics.js";

class Game {
    viewport = null;
    ctx = document.createElement('canvas').getContext("2d");
    scenes = [];
    currentScene = "default";
    scene = new Scene();
    entities = [];
    fullScreen = false;

    constructor(canvas=null, width=1920/2, height=1080/2, parent=document.querySelector('body')) {
        if (canvas) {
            this.viewport = canvas;
        } else {
            this.viewport = document.createElement('canvas');

            if (width && height) {
                this.viewport.width = width;
                this.viewport.height = height;
            } else {
                this.fullScreen = true;
                this.viewport.width = window.innerWidth;
                this.viewport.height = window.innerHeight;
            }


            parent.appendChild(this.viewport);
        }

        this.viewport.center = () => {
            return {
                x: this.viewport.width / 2,
                y: this.viewport.height / 2
            }
        }

        this.ctx = this.viewport.getContext("2d");

        // save the latest input data
        this.latestKeys = [];
        this.latestMouseData = {x: 0, y: 0, isClicking: false};

        // handle keyboard input
        document.addEventListener('keydown', e => {
            this.latestKeys.push(e.key.toLowerCase());
        });

        // handle keyboard inputs let go
        document.addEventListener('keyup', e => {
            let newKeys = [];

            this.latestKeys.forEach(k => {
                if(k !== e.key.toLowerCase()) newKeys.push(k);
            });

            this.latestKeys = [...newKeys];

            this.oldKeys.push(e.key.toLowerCase())
        });

        this.oldKeys = []

        // handle mouse click input
        document.addEventListener('mousedown', e => {
            this.latestMouseData.isClicking = true;
        });

        // handle mouse hold
        document.addEventListener('mouseup', e => {
            this.latestMouseData.isClicking = false;
        });

        // handle mouse move input
        document.addEventListener('mousemove', e => {
            this.latestMouseData.x = e.pageX;
            this.latestMouseData.y = e.pageY;
        });

        // request a key
        this.RequestKey = (key, letGo = false)=>{
            console.log(this.latestKeys, this.oldKeys);
            if (letGo == false) {
                if(this.latestKeys.includes(key)){
                    return true;
                }
            } else {
                if (this.oldKeys.includes(key)) {
                    return true;
                }
            }
            return false;
        }

        // request keys
        this.RequestKeys = (keys, type='all') => {
            let res = [];

            for(let key of keys) {
                res.push(this.latestKeys.includes(key));
            }

            if(type === 'all')
                return res.every(x => x === true);

            return res.includes(true);
        }

        // request mouse data
        this.RequestMouseData = (data)=>{
            if(data == 'x') return this.latestMouseData.x;
            if(data == 'y') return this.latestMouseData.y;
            if(data == 'click') return this.latestMouseData.isClicking;
        }

        // reset input data
        this.ResetKeys = ()=>{this.latestKeys = []}
    }

    start () {
        this.updateScene();

        this.entities.forEach(x => {
            x.start();
        })

        this.update();
    }
    
    update() {
        setInterval(()=>{
            if (this.fullScreen) {
                this.viewport.width = window.innerWidth;
                this.viewport.height = window.innerHeight;
            }

            this.scene.renderBg(this.ctx);

            
            this.entities.forEach(entity => {
                entity.update();
                
                if(entity.visual.affectedByCamera) {
                    entity.renderTransform.position = new Vector2(
                        (entity.transform.position.x - this.scene.camera.transform.position.x) * this.scene.camera.zoom,
                        (entity.transform.position.y - this.scene.camera.transform.position.y) * this.scene.camera.zoom,
                    )
                    
                    
                    entity.renderTransform.size = {
                        width: entity.transform.size.width * this.scene.camera.zoom,
                        height: entity.transform.size.height * this.scene.camera.zoom,
                    }
                } else {
                    entity.renderTransform.position = new Vector2(entity.transform.position.x, entity.transform.position.y),
                    entity.renderTransform.size = {...entity.transform.size}
                }

                entity.render(this.ctx);
            });
            this.oldKeys = [];
        }, 1);
    }
    
    updateScene(newScene = "default") {
        this.currentScene = newScene;
        this.scene = this.scenes.find(x => x.id === this.currentScene);
        this.entities = this.scene.entities;
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        this.entities.filter(x => x !== entity);
    }

    searchEntity(id) {
        this.entities.filter(x => x.id !== id);
    }
}

class Transform {
    constructor (x=0, y=0, width=1, height=1) {
        this.position = new Vector2(x, y)
        this.size = {width, height}
    }

    setTransform(x, y, width, height) {
        this.position = new Vector2(x, y);

        this.size.width = width;
        this.size.height = height;
    }

    Translate (data=new Vector2(0, 0)) {
        this.position.x += data.x;
        this.position.y += data.y;
    }

    Dialate (data=new Vector2(0, 0)){
        this.size.width += data.x;
        this.size.height += data.y;
    }

    GetPoints () {
        return {
            left: this.position.x,
            top: this.position.y,
            right: this.position.x + this.size.width,
            bottom: this.position.y + this.size.height,
            midX: (this.size.width / 2) + this.position.x,
            midY: (this.size.height / 2) + this.position.y
        }
    }
}

class Vector2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

class Scene {
    id = "";
    entities = [];

    constructor (id="default", entities=[]) {
        this.id = id;
        this.entities = entities;
        this.camera = new Camera(0, 0, 1);
    }

    update() {

    }

    background = {
        type: "solid",
        color: "#3a404a"
    }

    renderBg(ctx=document.createElement('canvas').getContext("2d")) {
        ctx.fillStyle = this.background.color;

        if (this.background.type === "solid")
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

class Entity {
    id = "";
    layer = "";

    transform = new Transform();
    renderTransform = new Transform();
    visual = {
        show: true,
        type: "rect",
        color: "red",
        spriteData: null,
        affectedByCamera: true
    };

    collider = new Collider(null)
    physics = new PhysicsBody(null)

    constructor(x, y, width, height) {
        this.transform = new Transform(x, y, width, height)
        this.renderTransform = new Transform(x, y, width, height)
    }

    render(ctx=document.createElement('canvas').getContext("2d")) {
        ctx.fillStyle = this.visual.color;
        
        if (this.visual.show) {
            if (this.visual.type=== 'rect') {
                ctx.fillStyle = this.visual.color;
                ctx.fillRect(
                    this.renderTransform.position.x,
                    this.renderTransform.position.y,
                    this.renderTransform.size.width,
                    this.renderTransform.size.height,
                );
            }

            else if(this.visual.type==='sprite') {
                if(this.visual.spriteData !== null) {
                    // generate a second canvas
                    let renderer = document.createElement('canvas');

                    renderer.width = this.visual.spriteData.width || 0;
                    renderer.height = this.visual.spriteData.height || 0;
                    // render our ImageData on this canvas
                    renderer.getContext('2d').putImageData(this.visual.spriteData, 0, 0);
                    // Now we can scale our image, by drawing our second canvas
                    ctx.drawImage(
                        renderer,
                        this.renderTransform.position.x,
                        this.renderTransform.position.y, 
                        this.renderTransform.size.width, 
                        this.renderTransform.size.height, 
                    );
                }
            }
        }
        
    }

    update () {

    }

    start () {

    }
}

class Camera {
    constructor (x, y, zoom) {
        this.transform = new Transform(x, y);
        this.zoom = zoom;
    }
}



export { Game, Transform, Entity, Vector2, Scene, Camera };