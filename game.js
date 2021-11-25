let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth*4;
ctx.canvas.height = window.innerHeight*4;

let player = new Player(canvas.width/2,canvas.height/2,canvas.height/10)
player.draw(ctx)

var bLength = 5;
var bHeight = 5;

playX = 0
playY = 0
trX = 0
trY = 0
fade = 0
completeOnce = true;
var lastTick = 0
var movX = false;
var movY = false;
var tileWidth = canvas.height/8;
var levelNum = -1;
var level;
var spawn = [
    [0,0],
    [0,0],
    [0,1],
    [0,3],
    [0,0],
    [2,0],
    [0,0],
    [0,0],
    [0,0]
];
var levels = [
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 5]
    ],
    [
        [0, 0, 0, 0 ,0],
        [0, 3, 0, 4 ,0],
        [0, 0, 0, 0 ,0],
        [0, 6, 0, 5 ,0],
        [0, 0, 0, 0 ,0]
    ],
    [
        [5, 0, 3, 4, 0, 0, 0],
        [0, 0, 3, 4, 0, 0, 0],
        [6, 0, 3, 4, 0, 0, 0]
    ],
    [
        [0, 0, 0, 2, 2,],
        [0, 0, 4, 6, 2,],
        [0, 4, 3, 5, 6,],
        [0, 0, 4, 6, 2,],
        [0, 0, 0, 2, 2,]
    ],
    [
        [6, 0, 0, 5],
        [0, 3, 4, 0],
        [0, 4, 3, 0],
        [5, 0, 0, 6],
    ],
    [
        [2, 0, 0, 0, 2],
        [0, 4, 3, 5, 0],
        [0, 6, 2, 6, 0],
        [0, 5, 3, 4, 0],
        [2, 0, 0, 0, 2]
    ],
    [
        [5, 0, 0, 2],
        [0, 4, 0, 0],
        [0, 3, 3, 0],
        [2, 0, 0, 6]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0],
        [0, 0, 2, 2, 2, 2, 0],
        [0, 4, 5, 6, 5, 4, 0],
        [0, 2, 2, 2, 2, 0, 0],
        [0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    [
        [[5]]
    ]
];


function nextLevel() {
    levelNum += 1;
    level = JSON.parse(JSON.stringify(levels[levelNum]))
    bHeight = level.length;
    bLength = level[0].length;
    playX = spawn[levelNum][0];
    playY = spawn[levelNum][1];
    trX = playX;
    trY = playY;
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] == 2) {
                level[i][j] = new Wall(j,i,tileWidth,"#1A5E63");
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            }
            if (level[i][j] == 3) {
                level[i][j] = new Box(j,i,tileWidth,'#E23B3B');
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
            if (level[i][j] == 4) {
                level[i][j] = new Box(j,i,tileWidth,'#3C4CE0');
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
            if (level[i][j] == 5) {
                level[i][j] = new Pad(j,i,tileWidth,'#E23B3B');
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
            if (level[i][j] == 6) {
                level[i][j] = new Pad(j,i,tileWidth,'#3C4CE0');
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
        }
    }
}
nextLevel();
function drawBoxes() {
    var complete = true;
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] instanceof Pad) {
                complete = (complete && boxOnPad(i,j,level[i][j].color)); 
                level[i][j].size = tileWidth;
                level[i][j].draw(ctx);
            }
        }
    }
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] instanceof Box || level[i][j] instanceof Wall) {
                level[i][j].size = tileWidth;
                level[i][j].draw(ctx);
            }
            
        }
    }
    if (complete && completeOnce) {
        completeOnce = false;
        let down = false;
        let x = -50;
        let b = setInterval(function (){
            x += 5
            if (!down) {
               fade = x/100 
            }
            else (
                fade = (300-x)/100
            )
            if (!down && x >= 100) {
                down = true;
                nextLevel();
            }
            if (x >= 300) {
                completeOnce = true;
                clearInterval(b);
            }
            
        },10);

    }
}

function boxOnPad(xb,yb,col) {
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] instanceof Box) {
                if (level[i][j].coords.x == yb && level[i][j].coords.y == xb && level[i][j].color == col) {
                    return true;
                }
            }
        }
    }
    return false;
}
function moveBoxes(xp,yp,xmov,ymov) {
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] instanceof Box) {
                if (level[i][j].coords.x == xp && level[i][j].coords.y == yp) {
                    let xt = level[i][j].coords.x+xmov;
                    let yt = level[i][j].coords.y+ymov;
                    if (0 <= xt && xt <= bLength-1 && 0 <= yt && yt <= bHeight-1) { 
                        if (!(level[yt][xt] instanceof Wall)) {
                            moveBoxes(xp+xmov,yp+ymov,xmov,ymov)
                            level[i][j].coords.x += xmov;
                            level[i][j].coords.y += ymov;
                        }  
                        else {
                            moveBoxes(xp-xmov,yp-ymov,-xmov,-ymov)
                            trX -= xmov;
                            trY -= ymov;
                        }
                    }
                    else {
                        moveBoxes(xp-xmov,yp-ymov,-xmov,-ymov)
                        trX -= xmov;
                        trY -= ymov;
                    }
                }
            }
        }
    }
}

window.addEventListener('keydown',this.check,false);
function check(e) {
    var code = e.keyCode;
    switch (code) {
        case 37: 
            if (playX > 0.9 && !(level[trY][trX-1] instanceof Wall)) {
                trX -= 1
                moveBoxes(trX,trY,-1,0);
            }
            break;
        case 38:
            if (playY > 0.9 && !(level[trY-1][trX] instanceof Wall)) {
                trY -= 1
                moveBoxes(trX,trY,0,-1);
            }
            break;
        case 39: 
            if (playX < bLength-1.1 && !(level[trY][trX+1] instanceof Wall)) {    
                trX += 1
                moveBoxes(trX,trY,1,0);
            }
            break;
        case 40: 
            if (playY < bHeight-1.1 && !(level[trY+1][trX] instanceof Wall)) {
                trY += 1
                moveBoxes(trX,trY,0,1);
            }
            break;
        case 82: 
            levelNum -= 1; 
            nextLevel();
            break;
    }
}

le = 0.1

function gameLoop(timestamp) {
    ctx.canvas.width = window.innerWidth*4;
    ctx.canvas.height = window.innerHeight*4;
    tileWidth = canvas.height/8;
    player.radius = tileWidth/2;
    let dt = timestamp-lastTick;
    lastTick = timestamp;

    if (Math.abs(trY - playY)%1 < le || 1-le < Math.abs(trY - playY)%1 < 1+le && !movY) {
        playX = (playX+trX)/2;
        movX = (!(Math.abs(trX - playX)%1 < le))

    }
    else {
        movX = false;
    }
    
    if (Math.abs(trX - playX)%1 < le || 1-le < Math.abs(trY - playY)%1 < 1+le && !movX) {
        playY = (playY+trY)/2;
        movY = (!(Math.abs(trY - playY)%1 < le))
    }
    else {
        movY = false;
    }

    ctx.fillStyle = "#1A5E63";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#028090";
    if (levelNum == 0) {
        ctx.font = `${Math.floor(canvas.width/24)}px Nunito`
        ctx.fillText("Use arrow keys",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2));
        ctx.fillText("       to move",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2 + (Math.floor(canvas.width/24))));
        ctx.fillText("Retry with R",((canvas.width-tileWidth*bLength)/2 + tileWidth*bLength + canvas.width)/2-canvas.width/9,(canvas.height/2));
    }
    if (levelNum == 8) {
        ctx.font = `${Math.floor(canvas.width/24)}px Nunito`
        ctx.fillText("Thanks for playing",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2));
    }
    ctx.font = `${Math.floor(canvas.height/24)}px Nunito`
    ctx.fillText(`Level ${levelNum+1}/${levels.length}`,(canvas.width-tileWidth*bLength)/2,(canvas.height-tileWidth*bHeight)/2-15);
    ctx.fillRect((canvas.width-tileWidth*bLength)/2,(canvas.height-tileWidth*bHeight)/2,tileWidth*bLength,tileWidth*bHeight)
    drawBoxes();    
    player.draw(ctx,playX*tileWidth+(canvas.width-tileWidth*(bLength-1))/2,playY*tileWidth+tileWidth/2 + (canvas.height-tileWidth*bHeight)/2);
    ctx.fillStyle = `rgba(26, 94, 99, ${fade})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)