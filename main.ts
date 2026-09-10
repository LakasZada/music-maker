let page = 0
let cursor = 0
let stepDuration = 250

let notes = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
]

let freqs = [
    523,
    440,
    392,
    330,
    262
]


function draw() {
    basic.clearScreen()

    for (let x = 0; x <= 4; x++) {
        let col = page * 5 + x

        for (let row = 0; row <= 4; row++) {
            if ((notes[col] & (1 << row)) != 0) {
                led.plotBrightness(x, row, 80)
            }
        }
    }

    let cursorX = cursor % 5
    let cursorY = Math.idiv(cursor, 5)

    led.plotBrightness(cursorX, cursorY, 255)
}


function sendSong() {
    serial.writeLine("SONG")

    for (let col = 0; col <= 9; col++) {
        serial.writeLine("" + notes[col])
    }

    serial.writeLine("END")
}


function playSong() {
    for (let col = 0; col <= 9; col++) {
        let playedSomething = false

        for (let row = 0; row <= 4; row++) {
            if ((notes[col] & (1 << row)) != 0) {
                music.playTone(freqs[row], stepDuration)
                playedSomething = true
            }
        }

        if (!playedSomething) {
            basic.pause(stepDuration)
        }
    }
}


input.onButtonPressed(Button.A, function () {
    cursor += 1

    if (cursor >= 25) {
        cursor = 0
    }

    draw()
})


input.onButtonPressed(Button.B, function () {
    let x = cursor % 5
    let row = Math.idiv(cursor, 5)
    let col = page * 5 + x

    notes[col] = notes[col] ^ (1 << row)

    draw()
})


input.onButtonPressed(Button.AB, function () {
    sendSong()
    playSong()
    draw()
})


input.onGesture(Gesture.Shake, function () {
    if (page == 0) {
        page = 1
    } else {
        page = 0
    }

    cursor = 0
    draw()
})


draw()