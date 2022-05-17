var confettiElement = document.getElementById('donationConfetti')

function displayConfetti() {
    amountDonated = parseInt(document.getElementById('amountDonated').value)
    if (amountDonated >= 50) {
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
            start_from_edge: false,
            respawn: true
        }

        var confetti = new ConfettiGenerator(confettiSettings)

        confetti.render()

        setTimeout(() => {
            confetti.clear()
        }, 10000)
        
    }
}


function setup() {
    document.getElementById('submitButton').addEventListener("click", displayConfetti)
}


$(document).ready(setup)