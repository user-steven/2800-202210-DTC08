var amountDonated = 0

var confettiElement = document.getElementById('donationConfetti')

var confettiSettings = {
    target: confettiElement,
    max: amountDonated,
    size: 2,
    animate: true,
    props: ["circle", "square", "triangle", "line"],
    colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
    clock: 25,
    rotate: true,
    width: screen.width,
    height: screen.height,
    start_from_edge: false,
    respawn: true
}
var confetti = new ConfettiGenerator(confettiSettings)

function displayConfetti() {
    amountDonated = parseInt(document.getElementById('amountDonated').value)
    console.log(amountDonated)
    if (amountDonated >= 50) {
        confetti.render()
        setTimeout(() => {
            confetti.clear()
        }, 5000)
    }
}

function setup() {
    document.getElementById('submitButton').addEventListener("click", displayConfetti)
}


$(document).ready(setup)