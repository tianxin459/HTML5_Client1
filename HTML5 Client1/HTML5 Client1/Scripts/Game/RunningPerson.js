var framePerson = {
    width: 41,//50,//
    height: 41,//50,//
    borderwidth: 1
}

var personStatus = {
    STANDING: 0,
    RUNNING: 1,
    JUMPPING: 2
}


var direction = {
    S: 1,
    E: 2,
    W: 3,
    N: 4
}

var person = function () {
    this.img = new Image;
    this.groundY = null;
    this.img.src = "../Images/Sprite/sprite_animation_frames_1.png";
    this.frame = framePerson;
    this.currentframe = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.position = { X: 0, Y: 0 };
    this.frameRow = 0;
    this.frameCol = 0;
    this.status = personStatus.STANDING;
    this.speed = 3;
    this.runningSpeed = 3;
    this.running = false;
    //this.runningDirection = direction.E;
    this.runningDirection = 1;
    this.jumppingHight = 50;
    this.jumppingSpeed = 5;
    this.jumppingStartY = 0;
    this.jumppingEndY = 0;
    this.jumppingProgress = false;
    this.jumppingUp = false;
    this.jumppingDown = false;
    this.transparentObjValue = 200;
    this.speedVertical = 2;
    this.speedHorizantal = 0;
    this.speedMax = 10;
    this.accelerateHorizantal = 0;
    this.accelerateVertical = 2;
    this.debug = 1;

    this.bondary = { top: null, bottom: null, left: null, right: null };
}

person.prototype.setPosition = function (x, y) {
    this.position.X = (x == undefined) ? 0 : x;
    this.position.Y = (y == undefined) ? 0 : y;
}

person.prototype.nextFrame = function () {
    if (this.speedHorizantal == 0) {
        this.currentframe = 0;
    }
    else {
        this.currentframe = (this.currentframe + 1) % 29;
    }
    this.frameRow = Math.floor(this.currentframe / 6);
    this.frameCol = Math.floor(this.currentframe % 6);
    this.offsetX = this.frame.width * this.frameCol + this.frame.borderwidth * this.frameCol + this.frame.borderwidth;
    this.offsetY = this.frame.height * this.frameRow + this.frame.borderwidth * this.frameRow + this.frame.borderwidth;
};

person.prototype.nextPosition = function (c) {
    var s = this.speedHorizantal + this.accelerateHorizantal;
    this.speedHorizantal = (s > this.speedMax) ? this.speedMax : s;
    if (this.speedHorizantal <= 0) {
        this.speedHorizantal = 0;
        this.accelerateHorizantal = 0;
        if (this.status == personStatus.RUNNING) {
            this.setStatus(personStatus.STANDING);
        }
        else if (this.status == personStatus.JUMPPING) {

        }
    }
    this.position.X = (this.position.X + this.speedHorizantal * this.runningDirection) % this.bondary.right;

    if (this.standingSolid(c) && this.speedVertical <= 0) {
        if (this.speedHorizantal == 0) {
            this.setStatus(personStatus.STANDING);
        }
        else {
            this.setStatus(personStatus.RUNNING);
        }
        this.speedVertical = 0;
        this.position.Y = (this.position.Y - this.speedVertical) % this.bondary.bottom;
    }
    else {
        this.speedVertical -= this.accelerateVertical;
        this.position.Y = (this.position.Y - this.speedVertical) % this.bondary.bottom;
    }
};



person.prototype.getCurrentFrame = function () {
    this.frameRow = Math.floor(this.currentframe / 6);
    this.frameCol = Math.floor(this.currentframe % 6);
    this.offsetX = this.frame.width * this.frameCol + this.frame.borderwidth * this.frameCol + this.frame.borderwidth;
    this.offsetY = this.frame.height * this.frameRow + this.frame.borderwidth * this.frameRow + this.frame.borderwidth;

};

person.prototype.running = function (c) {
    this.nextFrame();
    c.drawImage(this.img, this.offsetX, this.offsetY, this.frame.width, this.frame.height, this.position.X, this.position.Y, this.frame.width, this.frame.height);
};


person.prototype.animate = function (c) {
    switch (this.status) {
        case personStatus.RUNNING:
            this.running = true;
            this.nextFrame();
            this.nextPosition(c);
            break;
        case personStatus.STANDING:
            this.currentframe = 0;
            this.running = false;
            this.jumppingProgress = false;
            this.nextPosition(c);
            break;
        case personStatus.JUMPPING:
            this.nextPosition(c);
            break;
    }
    this.getCurrentFrame();
    c.drawImage(this.img, this.offsetX, this.offsetY, this.frame.width, this.frame.height, this.position.X, this.position.Y, this.frame.width, this.frame.height);
};

person.prototype.setStatus = function (status) {
    switch (status) {
        case personStatus.RUNNING:
            this.status = status;
            break;
        case personStatus.STANDING:
            this.status = status;
            // this.speedHorizantal = 0;
            this.speedVertical = 0;
            this.accelerateHorizantal = -1;
            //this.accelerateVertical = 0;
            this.jumppingStartY = 0;
            break;
        case personStatus.JUMPPING:
            if (this.jumppingStartY == 0) {
                this.jumppingStartY = this.position.Y;
                this.jumppingEndY = this.jumppingStartY - this.jumppingHight;
                this.currentframe = 5;
                this.nextFrame();
                this.status = status;
                this.jumppingUp = true;
            }
            break;
    }
};

person.prototype.setDirection = function (d) {
    this.runningDirection = d;
};

person.prototype.standingSolid = function (c) {
    var x = this.position.X + Math.floor(this.frame.width / 2);
    var y = this.position.Y + this.frame.height + 1;
    var inTheGround = 0;
    var i;
    var divition;
    var cc = this.colorHexToRGB(c.fillStyle);

    var imgData = c.getImageData(x, y, 1, 1);
    for (i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i];
        imgData.data[i + 1] = imgData.data[i + 1];
        imgData.data[i + 2] = imgData.data[i + 2];
        inTheGround += imgData.data[i + 3];
    }

    var isbgColor = this.compareRGBColor(cc, imgData.data);

    divition = i / 4;
    inTheGround = inTheGround / ((divition == 0) ? 1 : divition);
    //c.putImageData(imgData, x, y);
    return !isbgColor && (inTheGround > this.transparentObjValue);
};

person.prototype.compareRGBColor = function (colorArray1, colorArray2) {
    var sameColor = false;
    if (colorArray1.length != colorArray2.length)
        return false;

    for (var i = 0; i < colorArray1.length; i += 4) {
        sameColor = colorArray1[i] == colorArray2[i] && colorArray1[i + 1] == colorArray2[i + 1] && colorArray1[i + 2] == colorArray2[i + 2];
        if (!sameColor)
            return false;
    }
    return sameColor;
};


person.prototype.colorHexToRGB = function (color) {
    color = color.toUpperCase();
    var regexpHex = /^#[0-9a-fA-F]{3,6}$/;//Hex  
    if (regexpHex.test(color)) {
        var hexArray = new Array();
        var count = 1;
        for (var i = 1; i <= 3; i++) {
            if (color.length - 2 * i > 3 - i) {
                hexArray.push(Number("0x" + color.substring(count, count + 2)));
                count += 2;
            } else {
                hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));
                count += 1;
            }
        }
        hexArray.push(255);//alpha
        return hexArray;//"RGB(" + hexArray.join(",") + ")";
    } else {
        return color;
    }
};