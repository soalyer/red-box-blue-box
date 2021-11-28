class Player {
    constructor(xPos,yPos,radi,bgcol,col) {
        movable.push(this);
        this.radius = radi;
        this.color = "lightgray";
        this.coords = {
            x: xPos,
            y: yPos
        }
        this.posCoords = {
            x: this.coords.x,
            y: this.coords.y
        }
        this.movX = false;
        this.movY = false;
    }
    draw(ctx) {
        this.position = {
            x: this.posCoords.x*tileWidth+(canvas.width-tileWidth*(bLength-1))/2,
            y: this.posCoords.y*tileWidth+tileWidth/2 + (canvas.height-tileWidth*bHeight)/2
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();    
        ctx.arc(this.position.x,this.position.y,this.radius,0,2 * Math.PI, false);
        ctx.fill();
    }

    checkMove() {
        if (Math.abs(this.coords.x - this.posCoords.x)%1 < le || 1-le < Math.abs(this.coords.y - this.posCoords.y)%1 < 1+le && !movY) {
            this.posCoords.x = (this.posCoords.x+this.coords.x)/2;
            movX = (!(Math.abs(this.coords.x - this.posCoords.x)%1 < le))
    
        }
        else {
            movX = false;
        }
        
        if (Math.abs(this.coords.x - this.posCoords.x)%1 < le || 1-le < Math.abs(this.coords.y - this.posCoords.y)%1 < 1+le && !movX) {
            this.posCoords.y = (this.posCoords.y+this.coords.y)/2;
            movY = (!(Math.abs(this.coords.y - this.posCoords.y)%1 < le))
        }
        else {
            movY = false;
        }
    }
}

class Tile {
    constructor(xPos,yPos,diameter,col,move) {
        if (move) {
            this.movable = true;
            movable.push(this);
        }
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
        this.movX = false;
        this.movY = false;
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
        if (this.movable) {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.beginPath();    
            ctx.arc(this.position.x+tileWidth/2,this.position.y+tileWidth/2,this.size/2,0,2 * Math.PI, false);
            ctx.fill();
        }
    }
    checkMove() {
        if (Math.abs(this.coords.x - this.posCoords.x)%1 < le || 1-le < Math.abs(this.coords.y - this.posCoords.y)%1 < 1+le && !movY) {
            this.posCoords.x = (this.posCoords.x+this.coords.x)/2;
            movX = (!(Math.abs(this.coords.x - this.posCoords.x)%1 < le))
    
        }
        else {
            movX = false;
        }
        
        if (Math.abs(this.coords.x - this.posCoords.x)%1 < le || 1-le < Math.abs(this.coords.y - this.posCoords.y)%1 < 1+le && !movX) {
            this.posCoords.y = (this.posCoords.y+this.coords.y)/2;
            movY = (!(Math.abs(this.coords.y - this.posCoords.y)%1 < le))
        }
        else {
            movY = false;
        }
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
