function loadSkeleton() {
    $("#header").load("./template/header.ejs")
    $("#footer").load("./template/footer.ejs")
}

function setup() {
    loadSkeleton()
}

$(document).ready(setup)
