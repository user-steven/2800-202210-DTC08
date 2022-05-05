function loadSkeleton() {
    $("#navigation").load("./template/navbar.html")
    //$("#header").load("./template/header.html")
    $("#footer").load("./template/footer.html")
}

function setup() {
    loadSkeleton()
}

$(document).ready(setup)
