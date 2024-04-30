class Collider {
    constructor (entity) {
        this.bounce = .2;

        this.GetPoints = () => {
            return {
                left: entity.transform.position.x,
                top: entity.transform.position.y,
                right: entity.transform.position.x + entity.transform.size.width,
                bottom: entity.transform.position.y + entity.transform.size.height,
                midX: (entity.transform.size.width / 2) + entity.transform.position.x,
                midY: (entity.transform.size.height / 2) + entity.transform.position.y
            }
        }
        this.GetRenderPoints = () => {
            return {
                left: entity.renderTransform.position.x,
                top: entity.renderTransform.position.y,
                right: entity.renderTransform.position.x + entity.renderTransform.size.width,
                bottom: entity.renderTransform.position.y + entity.renderTransform.size.height,
                midX: (entity.renderTransform.size.width / 2) + entity.renderTransform.position.x,
                midY: (entity.renderTransform.size.height / 2) + entity.renderTransform.position.y
            }
        }

        this.HasCollided = (other) => {
            let a = this.GetPoints();
            let b = other.collider.GetPoints();

            if(
                a.bottom < b.top || 
                a.top > b.bottom ||
                a.right < b.left ||
                a.left > b.right
            ) {
                return false;
            }

            return true;
        }

        this.debug = {
            drawPoints: (Game, color) => {
                let points = this.GetRenderPoints();
                Game.ctx.fillStyle = color;

                Game.ctx.fillRect(points.left, points.top, 2, 2);
                Game.ctx.fillRect(points.right, points.top, 2, 2);
                Game.ctx.fillRect(points.left, points.bottom, 2, 2);
                Game.ctx.fillRect(points.right, points.bottom, 2, 2);
            }
        };
    }
}

class PhysicsBody {
    constructor(entity, collidable) {
        this.vx = 0;
        this.vy = 0;
        this.velocityMultiplier = 0.25;
        this.STICKY_THRESHOLD = 0.004;

        this.gravity = 0.02; 
        

        this.gravitySpeed = this.gravity;

        this.velocityXSlowdown = 0.02;

        this.step = () => {
            collidable.forEach(other => {
                const collision = entity.collider.HasCollided(other);

                if(collision) {
                    this.resolveElastic(other);
                }
            });

            entity.transform.Translate({x: this.vx * this.velocityMultiplier, y: this.vy})
            
            //gravity
            this.vy += this.gravitySpeed;

            if(this.vx < 0) {
                //vx slowdown
                this.vx += this.velocityXSlowdown;
            } else if(this.vx > 0) {
                //vx slowdown
                this.vx -= this.velocityXSlowdown;
            }
        }

        this.resolveElastic = (other) => {
            let aPoints = entity.collider.GetPoints();
            let bPoints = other.collider.GetPoints();

            let aMid = {x: aPoints.midX, y: aPoints.midY};
            let bMid = {x: bPoints.midX, y: bPoints.midY};

            let dx = (bMid.x - aMid.x) / (other.transform.size.width / 2);
            let dy = (bMid.y - aMid.y) / (other.transform.size.height / 2);
            
            let absDX = Math.abs(dx);
            let absDY = Math.abs(dy);

            if(Math.abs(absDX - absDY) < 0.1) {
                if(dx < 0) {
                    entity.transform.position.x = bPoints.right;
                } else {
                    entity.transform.position.x = bPoints.left - entity.transform.size.width;
                }

                if(dy < 0) {
                    entity.transform.position.y = bPoints.bottom;
                } else {
                    entity.transform.position.y = bPoints.top - entity.transform.size.height;
                }

                if(Math.random() < 0.5) {
                    this.vx = -this.vx * other.collider.bounce;

                    if(Math.abs(this.vx) < this.STICKY_THRESHOLD) {
                        this.vx = 0;
                    }
                }
                else {
                    this.vy = -this.vy * other.collider.bounce;

                    if(Math.abs(this.vy) < this.STICKY_THRESHOLD) {
                        this.vy = 0;
                    }
                }
            } else if(absDX > absDY) {
                if(dx < 0) {
                    entity.transform.position.x = bPoints.right;
                } else {
                    entity.transform.position.x = bPoints.left - entity.transform.size.width;
                }

                this.vx = -this.vx * other.collider.bounce;

                if(Math.abs(this.vx) < this.STICKY_THRESHOLD) {
                    this.vx = 0;
                }
            } else {
                if(dy < 0) {
                    entity.transform.position.y = bPoints.bottom;
                } else {
                    entity.transform.position.y = bPoints.top - entity.transform.size.height;
                }

                this.vy = -this.vy * other.collider.bounce;

                if(Math.abs(this.vy) < this.STICKY_THRESHOLD) {
                    this.vy = 0;
                }
            }
        }

        this.vy = Math.round(this.vy);
    }

    addForce(direction) {
        this.vx += direction.x;
        this.vy += direction.y;
    }
}

export { Collider, PhysicsBody }