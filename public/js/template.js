function loadSkeleton() {
    $("#header").load("./template/header.ejs")
    $("#footer").load("./template/footer.html")
}

function setup() {
    loadSkeleton()
}

$(document).ready(setup)
