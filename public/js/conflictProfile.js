function showCard(data) {

}

function getArticle(id) {
    console.log("In getArticle")
    // await $.ajax({
    //     type: `GET`,
    //     url: `http://localhost:5100/getArticle/${id}`,
    //     success: showCard
    // })
}

function setup () {
    console.log(`<%= conflictName %>`);
}

$(document).ready(setup)