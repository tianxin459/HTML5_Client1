var tile = {
    width: 16,
    heigth: 16,
    targetWidth: 32,
    targetHeight: 32,
    borderWidth: 1
}

var background = function () {
    this.img = new Image();
    this.img.src = "Images/Sprite/Mario/tiles.png";
    this.LT = { x: 151, y: 21 };
    this.RB = { x: 235, y: 106 };

    this.tile = tile;

    this.colNum = 5;
    this.rowTotal = 300;
    this.colTotal = 30;
    this.tileMap = [];
    this.scroll = { x: 0, y: 0 };
}

background.prototype.initialize = function () {
    for (var r = 0; r < this.rowTotal; r++) {
        this.tileMap[r] = [];
        for (var c = 0; c < this.colTotal; c++) {
            this.tileMap[r][c] = 0;
        }
    }
}

background.prototype.setGround = function (fromRow, fromCol, toRow, toCol) {
    for (var r = fromRow; r <= toRow; r++) {
        for (var c = fromCol; c <= toCol; c++) {
            this.tileMap[r][c] = 7;
        }
    }


}


background.prototype.getTile = function (i) {
    var x = i % 5;
    var y = Math.floor(i / 5);
    x = this.LT.x + x * this.tile.width + this.tile.borderWidth * x + this.tile.borderWidth;
    y = this.LT.y + y * this.tile.heigth + this.tile.borderWidth * y + this.tile.borderWidth;
    return { offsetX: x, offsetY: y };
}

background.prototype.drawMap = function (c, startRow, startCol, endRow, endCol) {
    c.fillStyle = "skyblue";
    c.globalAlpha = 0.0;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.globalAlpha = 1;
    c.strokeStyle = "blue";
    c.fillStyle = "gray";


    for (var row = startRow; row < endRow; row++) {
        for (var col = startCol; col < endCol; col++) {
            var tilePositionX = tile.targetWidth * row;
            var tilePositionY = tile.targetHeight * col;

            tilePositionX -= scroll.x;
            tilePositionY -= scroll.y;


            if (this.tileMap[row][col] == 0) {
                //c.strokeRect(tilePositionX, tilePositionY, tile.width, tile.heigth);
            }
            else {
                //c.fillRect(tilePositionX, tilePositionY, tile.width, tile.heigth);
                var p = this.getTile(this.tileMap[row][col]);
                c.drawImage(this.img, p.offsetX, p.offsetY, this.tile.width, this.tile.heigth, tilePositionX, tilePositionY, this.tile.targetWidth, this.tile.targetHeight);
            }

        }
    }
}


background.prototype.drawWall = function (positionRow, positionCol, height) {
    for (var h = 0; h < height; h++) {
        this.tileMap[positionRow][positionCol - h] = 12;
    }
}