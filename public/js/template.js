//loads the header and footer elements for each page
function loadSkeleton() {
    $("#header").load("./template/header.ejs")
    $("#footer").load("./template/footer.ejs")
}

//setup function called whenever any page is loaded
function setup() {
    loadSkeleton()
}

$(document).ready(setup)