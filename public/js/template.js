function loadSkeleton() {
    $("#header").load("./template/header.html")
    $("#footer").load("./template/footer.html")
}

function setup() {
    loadSkeleton()
}

$(document).ready(setup)