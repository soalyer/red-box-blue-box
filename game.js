let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth*4;
ctx.canvas.height = window.innerHeight*4;

movable = []
let player = new Player(canvas.width/2,canvas.height/2,canvas.height/10)


var bLength = 5;
var bHeight = 5;

fade = 0
completeOnce = true;
var lastTick = 0
var movX = false;
var movY = false;
var tileWidth = canvas.height/8;
var level;
var spawn = [
    [0,0],
    [0,0],
    [0,2],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [2,0],
    [0,0],
    [2,2],
    [2,2],
    [0,0]
];
var levels = [
    /* 
    0,1 = nothing
    2 = wall
    3,4 = red, blue box
    5,6 = red, blue pad
    7,8 = red, blue movable box */
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
        [2, 2, 0, 0, 0],
        [0, 4, 3, 5, 0],
        [0, 6, 2, 6, 0],
        [0, 5, 3, 4, 0],
        [2, 0, 0, 0, 2]
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0],
        [0, 7, 2, 3, 0],
        [0, 0, 5, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    [
        [0, 7, 0],
        [7, 0, 8],
        [0, 8, 5]
    ],
    [
        [6, 0, 8, 7, 8],
        [0, 2, 2, 2, 0],
        [0, 2, 0, 2, 0],
        [0, 2, 2, 2, 0],
        [7, 8, 7, 0, 5]
    ],
    [
        [[5]]
    ]
];
if (localStorage.num && localStorage.num >= 0 && localStorage.num < levels.length) {
    var levelNum = Number(localStorage.num);
}
else {
var levelNum = 0;
}

function refreshLevel() {
    localStorage.setItem("num",levelNum);
    level = JSON.parse(JSON.stringify(levels[levelNum]))
    bHeight = level.length;
    bLength = level[0].length;
    movable = [player]
    player.coords.x = spawn[levelNum][0];
    player.coords.y = spawn[levelNum][1];
    player.posCoords.x = player.coords.x;
    player.posCoords.y = player.coords.x;
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
            if (level[i][j] == 7) {
                level[i][j] = new Box(j,i,tileWidth,'#E23B3B',true);
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
            if (level[i][j] == 8) {
                level[i][j] = new Box(j,i,tileWidth,'#3C4CE0',true);
                level[i][j].coords.x = j;
                level[i][j].coords.y = i;
            } 
        }
    }
}
refreshLevel();
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
                levelNum += 1
                refreshLevel();
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

function moveBoxes(xp,yp,xmov,ymov,mover) {
    for (let i = 0; i < bHeight; i++) {
        for (let j = 0; j < bLength; j++) {
            if (level[i][j] instanceof Box && level[i][j].coords.x == xp && level[i][j].coords.y == yp) {
                if (true) {
                    moveBoxes(xp+xmov,yp+ymov,xmov,ymov,mover)
                    level[i][j].coords.x += xmov;
                    level[i][j].coords.y += ymov;
                }
                if (level[i][j].coords.x < 0 || level[i][j].coords.y < 0 || level[i][j].coords.x >= bLength || level[i][j].coords.y >= bHeight || (level[level[i][j].coords.y][level[i][j].coords.x] instanceof Wall)) {
                    mover.coords.x -= xmov;
                    mover.coords.y -= ymov;
                    moveBoxes(xp-xmov,yp-ymov,-xmov,-ymov,mover)
                    level[i][j].coords.x -= xmov;
                    level[i][j].coords.y -= ymov;
                    return
                }
                if (level[i][j].movable) {
                    level[i][j].coords.x -= xmov;
                    level[i][j].coords.y -= ymov;
                }
            }
        }
    }
    if (yp==player.coords.y && xp==player.coords.x) {
        mover.coords.x -= xmov;
        mover.coords.y -= ymov;
        console.log(mover.coords)
    }
}

function moveMovables(xo,yo) {
    for (let i = 0; i < movable.length; i++) {
        if (xo == -1) {
            if (movable[i].coords.x > 0.9 && !(level[movable[i].coords.y][movable[i].coords.x-1] instanceof Wall)) {
                moveBoxes(movable[i].coords.x-1,movable[i].coords.y,xo,yo,movable[i])
                movable[i].coords.x -= 1
                
            }
        } 
        if (yo == -1) {
            if (movable[i].coords.y > 0.9 && !(level[movable[i].coords.y-1][movable[i].coords.x] instanceof Wall)) {
                moveBoxes(movable[i].coords.x,movable[i].coords.y-1,xo,yo,movable[i])
                movable[i].coords.y -= 1
                
            }
        } 
        if (xo == 1) {
            if (movable[i].coords.x < bLength-1.1 && !(level[movable[i].coords.y][movable[i].coords.x+1] instanceof Wall)) {
                moveBoxes(movable[i].coords.x+1,movable[i].coords.y,xo,yo,movable[i])
                movable[i].coords.x += 1
                
            }
        } 
        if (yo == 1) {
            if (movable[i].coords.y < bHeight-1.1 && !(level[movable[i].coords.y+1][movable[i].coords.x] instanceof Wall)) {
                moveBoxes(movable[i].coords.x,movable[i].coords.y+1,xo,yo,movable[i])
                movable[i].coords.y += 1
                
            }
        } 
    }
}
window.addEventListener('keydown',this.check,false);
function check(e) {
    var code = e.keyCode;
    switch (code) {
        case 65:
        case 37: 
            moveMovables(-1,0);
            break;
        case 87:
        case 38:
            moveMovables(0,-1);
            break;
        case 68:
        case 39: 
            moveMovables(1,0);
            break;
        case 83:
        case 40: 
            moveMovables(0,1);
            break;
        case 82: 
            if (levelNum == levels.length-1) {
                levelNum -= levels.length-1;
            }
            refreshLevel();
            break;
    }
}

le = 0.1

if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    canvasSize = 1
}
else{canvasSize = 4}

function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop)
    ctx.canvas.width = window.innerWidth*canvasSize;
    ctx.canvas.height = window.innerHeight*canvasSize;
    tileWidth = canvas.height/8;
    player.radius = tileWidth/2;
    /*
    let dt = timestamp-lastTick;
    lastTick = timestamp;
    */
    ctx.fillStyle = "#1A5E63";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#028090";
    if (levelNum == 0) {
        ctx.font = `${Math.floor(canvas.width/24)}px Nunito`
        ctx.fillText("Use arrow keys",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2));
        ctx.fillText("       to move",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2 + (Math.floor(canvas.width/24))));
        ctx.fillText("Retry with R",((canvas.width-tileWidth*bLength)/2 + tileWidth*bLength + canvas.width)/2-canvas.width/9,(canvas.height/2));
    }
    if (levelNum == levels.length-1) {
        ctx.font = `${Math.floor(canvas.width/24)}px Nunito`
        ctx.fillText("Thanks for playing",(canvas.width-tileWidth*bLength)/4-canvas.width/7,(canvas.height/2));
        ctx.fillText("Play again with R",((canvas.width-tileWidth*bLength)/2 + tileWidth*bLength + canvas.width)/2-canvas.width/6,(canvas.height/2));
    }
    ctx.font = `${Math.floor(canvas.height/24)}px Nunito`
    ctx.fillText(`Level ${levelNum+1}/${levels.length-1}`,(canvas.width-tileWidth*bLength)/2,(canvas.height-tileWidth*bHeight)/2-15);
    ctx.fillRect((canvas.width-tileWidth*bLength)/2,(canvas.height-tileWidth*bHeight)/2,tileWidth*bLength,tileWidth*bHeight)
    drawBoxes(); 
    for (let i = movable.length-1; i >= 0; i--) {
        movable[i].checkMove();
        movable[i].draw(ctx);
    }  
    ctx.fillStyle = `rgba(26, 94, 99, ${fade})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

requestAnimationFrame(gameLoop)
