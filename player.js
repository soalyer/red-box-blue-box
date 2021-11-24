class Player {
    constructor(xPos,yPos,radi) {
        this.radius = radi;
        this.color = "lightgray";
        this.position = {
            x: xPos,
            y: yPos,
        }
    }
    draw(ctx,xPos,yPos) {
        this.position.x = xPos;
        this.position.y = yPos;
        ctx.fillStyle = this.color;
        ctx.beginPath();    
        ctx.arc(this.position.x,this.position.y,this.radius,0,2 * Math.PI, false);
        ctx.fill();
    }
}

class Tile {
    constructor(xPos,yPos,diameter,col) {
        this.size = diameter;
        this.color = col;
        this.coords = {
            x: xPos,
            y: yPos
        }
        this.posCoords = {
            x: this.coords.x,
            y: this.coords.y
        }
        this.position = {
            x: this.coords.x*tileWidth+(canvas.width-tileWidth*bLength)/2,
            y: this.coords.y*tileWidth+tileWidth/2 + (canvas.height-tileWidth*(bHeight+1))/2
        }
    }
}
class Box extends Tile {
    draw(ctx) {
        this.position = {
            x: (this.position.x + this.coords.x*tileWidth+(canvas.width-tileWidth*bLength)/2)/2,
            y: (this.position.y + this.coords.y*tileWidth+tileWidth/2 + (canvas.height-tileWidth*(bHeight+1))/2)/2
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,this.size,this.size);
    }
}

class Pad extends Tile {
    draw(ctx) {
        this.position = {
            x: this.coords.x*tileWidth+(canvas.width-tileWidth*bLength)/2,
            y: this.coords.y*tileWidth+tileWidth/2 + (canvas.height-tileWidth*(bHeight+1))/2
        }
        ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x+this.size/10,this.position.y+this.size/10,this.size*0.8,this.size*0.8);
            ctx.fillStyle = "#028090";
            ctx.fillRect(this.position.x+this.size/5,this.position.y+this.size/5,this.size*0.6,this.size*0.6);
    }
}

class Wall extends Tile {
    draw(ctx) {
        this.position = {
            x: this.coords.x*tileWidth+(canvas.width-tileWidth*bLength)/2,
            y: this.coords.y*tileWidth+tileWidth/2 + (canvas.height-tileWidth*(bHeight+1))/2
        }
        ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x-0.6,this.position.y-0.6,this.size+1.2,this.size+1.2);
    }
}