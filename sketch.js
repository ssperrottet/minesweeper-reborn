let board
let gamestate = 'menu'
let numberColors, timer = 0
let centerX = window.innerWidth / 2
let centerY = window. innerHeight / 2
let paused = false
let rows = 20
let cols = 20
let mines = 50
let activeField
let images = {}
let particles = []
let mainFont
let gameRules

function preload() {
    images['flags'] = [
        loadImage('graphics/markers/flag1.png'),
        loadImage('graphics/markers/flag2.png'),
        loadImage('graphics/markers/flag3.png')
    ]

    images['backs'] = [
        loadImage('graphics/backs/back1.png'),
        loadImage('graphics/backs/back2.png'),
        loadImage('graphics/backs/back3.png')
    ]

    images['bombs'] = [
        loadImage('graphics/bombs/bomb1.png'),
        loadImage('graphics/bombs/bomb2.png'),
        loadImage('graphics/bombs/bomb3.png')
    ]


    images['tiles'] = [
        loadImage('graphics/tiles/tile1.png'),
        loadImage('graphics/tiles/tile2.png'),
        loadImage('graphics/tiles/tile3.png')
    ]

    images['backgrounds'] = [
        loadImage('graphics/backgrounds/stonebackground.png'),
        loadImage('graphics/backgrounds/background(192).png'),
        loadImage('graphics/backgrounds/grass-background.jpg')
    ]

    images['slab'] = loadImage('graphics/tiles/empty-slab.png')
    mainFont = loadFont('graphics/font.otf')
    images['minesweeper'] = loadImage('graphics/minesweeper.png')
    images['cursor'] = createImg('graphics/cursor.gif')
    images['cursor'].hide()
    images['menu-background'] = loadImage('graphics/backgrounds/burnt.png')
}

function setup() {

    numberColors = {
        1 : color(20,20,255),
        2 : color(0,180,0),
        3 : color(180,0,0),
        4 : color(180,0,180),
        5 : color(0,180,180),
        6 : color(85, 189, 0),
        7 : color(251,0,255),
        8 : color(251,0,255)
    }
    gameRules = new GameMenu(centerX - 150, centerY - 150, 300, 300)
    createCanvas(window.innerWidth, window.innerHeight)
    textFont(mainFont)

    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}

function draw() {
    noSmooth()
    if (gamestate == 'play') {
        play()
    }
    else if (gamestate == 'game lost') {
        lose()
    }
    else if (gamestate == 'game won') {
        win()
    }
    else {
        menu()
    }
}

function title(titleString, titleColor) {
    textSize(100)
    fill(titleColor + 75)
    text(titleString, centerX, 103)
    fill(titleColor)
    text(titleString, centerX, 100)
}

function menu() {
    background(images['menu-background'])
    image(images['minesweeper'], centerX - 250, centerY - 275, 500, 100)

    //image(images['slab'], centerX - 125, centerY - 150, 250, 300)

    fill(25)
    textSize(25)
    //text('Width', centerX - 50, centerY - 100)
    //text('Height', centerX - 50, centerY)
    //text('Mines', centerX - 50, centerY + 100)
    gameRules.display()

    if (newButton(centerX, centerY + 225, 300, 75, 'Play', true, images['slab'])) {
        board = new Board(0, 0, rows, cols)
        windowResized()
        board.background = images['backgrounds'][gameRules.contents[1].active]
        board.tileImg = gameRules.contents[3].content[gameRules.contents[3].active]
        board.backImg = gameRules.contents[5].content[gameRules.contents[5].active]
        board.mineImg = gameRules.contents[7].content[gameRules.contents[7].active]
        board.markerImg = gameRules.contents[9].content[gameRules.contents[9].active]
        gamestate = 'play'
        activeField = -1
        paused = false
    }


}

function textField(x,y, width, height, value, id) {
    let lborder = x
    let rborder = x + width
    let tborder = y
    let bborder = y + height
    fill(150)
    rect(x, y, width, height)
    if (mouseX > lborder && mouseX < rborder && mouseY > tborder && mouseY < bborder) {
        fill(200)
        rect(x, y, width, height)
        if (mouseIsPressed && activeField != id) {
            mouseIsPressed = false
            activeField = id
        }
    }
    else if (activeField == id && mouseIsPressed) {
        images['cursor'].hide()
        activeField = -1
    }

    if (activeField == id) {
        fill(200)
        rect(x, y, width, height)

        if (keyIsPressed && keyCode >= 48 && keyCode <= 57) {
            keyIsPressed = false
            value *= 10
            value += keyCode - 48
        }
        if (keyIsPressed && keyCode == 8) {
            keyIsPressed = false
            value = int(value / 10)
        }

        images['cursor'].show()
        images['cursor'].position(13 + x + value.toString().length * 5, y + 9)
        print(value.toString().length * 10)
    }

    textSize(height / 2)
    textAlign(CENTER, CENTER)
    fill(25)
    text(value, x + width / 2, y + width / 2)
    return value
}

function newButton(x,y, width, height, label, active, img) {
    let leftBorder = x - width / 2
    let rightBorder = x + width / 2
    let topBorder = y - height / 2
    let bottomBorder = y + height / 2
    image(img, x - width / 2, y - height / 2, width, height)
    if (mouseX > leftBorder && mouseX < rightBorder && mouseY > topBorder && mouseY < bottomBorder && active) {
        fill (255, 255, 255, 50)
        rect(x - width / 2, y - height / 2, width, height)
        if (mouseIsPressed) {
            mouseIsPressed = false
            return true
        }
    }

    textSize(height / 2)
    textAlign(CENTER, CENTER)
    fill(0)
    text(label, x, y)
    return false
}

function lose() {
    let offset = random(0,1) > 0.5 ? -2 : 2
    background(board.background)
    //translate(offset, 0)
    if (timer < board.remaining.length) {
        board.remaining[timer].uncovered = true
        board.remaining[timer].break()
        timer += 1
    }
    else if (timer > 200) {
        timer = 0
        gamestate = 'menu'
        particles = []
    }
    else {
        timer += 1
    }
    board.display()
    title('Game Over!', 100)
}

function win() {
    background(board.background)
    board.display()
    timer += 1
    title('Game Won!', 100)
    if (timer > 200) {
        gamestate = 'menu'
        timer = 0
    }
}

function play() {
    background(board.background)
    board.display()

    if (keyIsPressed && keyCode == 27) {
        paused = !paused
        keyIsPressed = false
    }
    if (paused) {
        if (newButton(centerX, centerY, 200, 50, 'MENU', true, images['slab'])) {
            gamestate = 'menu'
        }
        return
    }

    let row = Math.floor((mouseX - board.x) / board.tileSize)
    let col = Math.floor((mouseY - board.y) / board.tileSize)

    if (row >= 0 && row < board.rows && col >= 0 && col < board.cols) {
        let tile = board.tiles[row][col]
        if (keyIsPressed && keyCode == 32) {
            keyIsPressed = false
            tile.flag = !tile.flag
        }
        if (mouseIsPressed == true) {
            mouseIsPressed = false
            if (mouseButton == LEFT) {
                if (tile.flag == false && tile.uncovered == false) {
                    tile.uncovered = true

                    tile.break()
                    if (board.set == false) {
                        board.setup(row, col, mines)
                        board.set = true
                    }
                    if (tile.mine) {
                        gamestate = "game lost"
                        timer = 0
                    }
                    if (tile.adjacent == 0) {
                        board.uncover(row, col)
                    }
                    board.addRemaining()
                }
            }
            else if (mouseButton == RIGHT) {
                tile.flag = !tile.flag
            }
        }
        else if (!tile.uncovered) {
            fill(255, 255, 255, 50)
            rect(board.x + row * board.tileSize, board.y + col * board.tileSize, board.tileSize, board.tileSize)
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight)
    centerX = window.innerWidth / 2
    centerY = window.innerHeight / 2
    gameRules.x = centerX - 150
    gameRules.y = centerY - 150
    gameRules.resize()
    if (board) {
        let xSize = (window.innerWidth - 100) / board.rows
        let ySize = (window.innerHeight - 100) / board.cols
        board.tileSize = xSize > ySize ? ySize : xSize
        board.x = centerX - board.rows * board.tileSize / 2
        board.y = centerY - board.cols * board.tileSize / 2
    }
}

class GameMenu {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.contents = [
            new Option('Theme', 'text', x, y, width, height / 6),
            new Option(['Stone', 'Classic', 'Outdoors'], 'dropdown', x + width * (1/3) + 5, y + 5, width * (2/3) - 10, height / 6 - 10),

            new Option('Tile Image', 'text', x, y + height / 6, width / 2, height / 6),
            new Option(images['tiles'], 'dropdownimg', x + width / 3 + 5, y + height / 6 + 5, width / 6 - 10, height / 6 - 10),

            new Option('Back Image', 'text', x + width / 2, y + height / 6, width / 2, height / 6),
            new Option(images['backs'], 'dropdownimg', x + width * (5/6) + 5, y + height / 6 + 5, width / 6 - 10, height / 6 - 10),

            new Option('Mine Image', 'text', x, y + height / 3, width / 2, height / 6),
            new Option(images['bombs'], 'dropdownimg', x + width / 3 + 5, y + height / 3 + 5, width / 6 - 10, height / 6 - 10),

            new Option('Marker', 'text', x + width / 2, y + height / 3, width / 2, height / 6),
            new Option(images['flags'], 'dropdownimg', x + width * (5/6) + 5, y + height / 3 + 5, width / 6 - 10, height / 6 - 10),

            new Option('Width', 'text', x, y + height / 2, width / 3, height / 6),

            new Option('Height', 'text', x + width / 3, y + height / 2, width / 3, height / 6),

            new Option('Mines', 'text', x + width * (2/3), y + height / 2, width / 3, height / 6)
        ]
        this.active = 0

    }

    display() {
        for (let item of this.contents) {
            item.display()
        }
        rows = textField(gameRules.x + gameRules.width / 6 + 5, gameRules.y + gameRules.height / 2 + 5, gameRules.width / 6 - 10, gameRules.height / 6 - 10, rows, 0)
        cols = textField(gameRules.x + gameRules.width / 2 + 5, gameRules.y + gameRules.height / 2 + 5, gameRules.width / 6 - 10, gameRules.height / 6 - 10, cols, 1)
        mines = textField(gameRules.x + gameRules.width * (5/6) + 5, gameRules.y + gameRules.height / 2 + 5, gameRules.width / 6 - 10, gameRules.height / 6 - 10, mines, 2)
        if (this.active) {
            this.active.expand()
        }
    }

    resize() {
        this.contents[0].x = this.x
        this.contents[0].y = this.y

        this.contents[1].x = this.x + this.width * (2/6) + 5
        this.contents[1].y = this.y + 5

        this.contents[2].x = this.x
        this.contents[2].y = this.y + this.height * (1/6)

        this.contents[3].x = this.x + this.width * (2/6) + 5
        this.contents[3].y = this.y + this.height * (1/6) + 5

        this.contents[4].x = this.x + this.width * (3/6)
        this.contents[4].y = this.y + this.height * (1/6)

        this.contents[5].x = this.x + this.width * (5/6) + 5
        this.contents[5].y = this.y + this.height * (1/6) + 5

        this.contents[6].x = this.x
        this.contents[6].y = this.y + this.height * (2/6)

        this.contents[7].x = this.x + this.width * (2/6) + 5
        this.contents[7].y = this.y + this.height * (2/6) + 5

        this.contents[8].x = this.x + this.width * (3/6)
        this.contents[8].y = this.y + this.height * (2/6)

        this.contents[9].x = this.x + this.width * (5/6) + 5
        this.contents[9].y = this.y + this.height * (2/6) + 5


        this.contents[10].x = this.x
        this.contents[10].y = this.y + this.height / 2

        this.contents[11].x = this.x + this.width / 3
        this.contents[11].y = this.y + this.height / 2

        this.contents[12].x = this.x + this.width * (2/3)
        this.contents[12].y = this.y + this.height / 2
    }
}

class Option {
    constructor(content, type, x, y, width, height) {

        this.content = content
        this.active = 0
        this.type = type // text, text field, dropdown
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    display() {
        fill(100)
        image(images['slab'], this.x, this.y, this.width, this.height)

        if (this.type == 'text') {
            textAlign(LEFT, CENTER)
            textSize(15)
            fill(0)
            text(this.content, this.x + 10, this.y + this.height / 2)
        }
        else if (this.type == 'dropdown') {
            fill(200)
            rect(this.x - 2, this.y - 2, this.width + 4, this.height + 4)
            if (newButton(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height, this.content[this.active], !gameRules.active, images['slab'])) {
                gameRules.active = this
            }
        }
        else if (this.type == 'dropdownimg') {
            fill(200)
            rect(this.x - 2, this.y - 2, this.width + 4, this.height + 4)
            if (newButton(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height, '', !gameRules.active, this.content[this.active])) {
                gameRules.active = this
            }
        }
    }

    expand() {
        fill(200)
        rect(this.x - 2, this.y + this.height + 2, this.width + 4, this.height * this.content.length + 6)
        let y = 5
            for (let i = 0; i < this.content.length; i++) {
                y += this.height
                    if (this.type == 'dropdown') {
                        if (newButton(this.x + this.width / 2, y + this.y + this.height / 2, this.width, this.height, this.content[i], true, images['slab'])) {
                            gameRules.active = 0
                            for (let option of gameRules.contents) {
                                option.active = i
                            }
                            return
                        }
                    }
                    else {
                        if (newButton(this.x + this.width / 2, y + this.y + this.height / 2, this.width, this.height, '', true, this.content[i])) {
                            gameRules.active = 0
                            this.active = i
                            return
                        }
                    }
            }

        if (!(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y + this.height && mouseY < this.y + this.height * (this.content.length + 1)) && mouseIsPressed) {
            gameRules.active = 0
            mouseIsPressed = false
            return
        }
        if ((keyIsPressed && keyCode == 27)) {
            gameRules.active = 0
            return
        }
    }
}

class Board {
    constructor(x, y, rows, cols) {
        this.x = x
        this.y = y
        this.rows = rows
        this.cols = cols
        this.tileImg
        this.backImg
        this.background
        this.mineImg
        this.tileSize = 30
        this.tiles = {}
        this.set = false
        this.remaining = []

        for (let row = 0; row < rows; row++) {
            this.tiles[row] = []
            for (let col = 0; col < cols; col++) {
                let tile = new Tile(row, col)
                this.remaining.push(tile)
                this.tiles[row].push(tile)
            }
        }
    }

    uncover(r, c) {
        let tiles = [this.tiles[r][c]]
        let explored = []
        while (tiles.length > 0) {
            r = tiles[0].r
            c = tiles[0].c
            this.tiles[r][c].flag = true
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r + i >= 0 && r + i < this.rows && c + j >= 0 && c + j < this.cols) {
                        let tile = this.tiles[r + i][c + j]
                        tile.uncovered = true
                        if (tile.mine == false && tile.adjacent == 0) {
                            let checked = false
                            for (let t of explored) {
                                if (t.c == tile.c && t.r == tile.r) {
                                    checked = true
                                }
                            }
                            if (checked == false) {
                                tiles.push(tile)
                                explored.push(tile)
                                tile.uncovered = true
                                tile.break()
                            }
                        }
                    }
                }
            }
            tiles.shift()
        }
    }

    display() {
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                this.tiles[row][col].display()
            }
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].display()
        }
    }

    addRemaining() {
        this.remaining = []
        let gameIsWon = true
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                let tile = this.tiles[row][col]
                if (!tile.uncovered) {
                    this.remaining.push(tile)
                    if (!tile.mine) {
                        gameIsWon = false
                    }
                }
            }
        }
        if (gameIsWon) {
            gamestate = 'game won'
        }
    }

    setup(row, col, mines) {
        for (let i = 0; i < mines; i++) {
            this.placeMine(row, col)
        }
    }

    placeMine(row, col) {
        let r = int(random(0, this.rows))
        let c = int(random(0, this.cols))

        if (this.tiles[r][c].mine || (r >= row - 1 && r <= row + 1 && c >= col - 1 && c <= col + 1)) {

            this.placeMine(row, col)
            return
        }
        this.tiles[r][c].mine = true
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r + i >= 0 && r + i < this.rows && c + j >= 0 && c + j < this.cols) {
                    this.tiles[r + i][c + j].adjacent += 1
                }

            }
        }
    }
}

class Tile {
    constructor(r, c) {
        this.r = r
        this.c = c

        this.mine = false
        this.uncovered = false
        this.adjacent = 0
        this.flag = false
    }

    display() {
        let x = board.x + this.r * board.tileSize
        let y = board.y + this.c * board.tileSize

        if (this.uncovered) {
            image(board.backImg, x, y, board.tileSize, board.tileSize)
            if (this.mine) {
                image(board.mineImg, x, y, board.tileSize, board.tileSize)
            }
            else if (this.adjacent) {
                fill(numberColors[this.adjacent])
                textStyle(BOLD)
                textSize(board.tileSize / 2)
                textAlign(CENTER, CENTER)
                text(this.adjacent, x + board.tileSize / 2, y + board.tileSize / 2)
                textStyle(NORMAL)
            }
        }
        else {
            if (this.flag) {
                image(board.tileImg, x, y, board.tileSize, board.tileSize)
                image(board.markerImg, x, y, board.tileSize, board.tileSize)
            }
            else {
                image(board.tileImg, x, y, board.tileSize, board.tileSize)
            }
        }
    }

    break() {
        let x = board.x + this.r * board.tileSize
        let y = board.y + this.c * board.tileSize

        for (let i = 0; i < 10; i++) {
            let particle = new Particle(board.tileImg,x + random(0, board.tileSize),y + random(0, board.tileSize), random(-4, 4), random(-2, 8), board.tileSize / 2)
            particles.push(particle)
        }
    }
}

class Particle {
    constructor(img, x, y, dx, dy, size) {
        this.img = img
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.size = size
    }

    display() {
        if (this.size > 0) {
            image(this.img, this.x, this.y, this.size, this.size)
        }
        else {
            particles.shift()
        }

        this.x += this.dx
        this.y += this.dy

        this.dx *= random(0.75, 1.25)
        this.dy += random(0.5, 1.5)

        this.size -= 0.5
    }
}