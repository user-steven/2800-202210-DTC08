var to_add;
var articlesId

function addCard(article) {
    console.log(article)
    to_add += 
    `<div class="container">
        <h4><a href="${article[0].articleLink}"><b>${article[0].name}</b></a></h4>
        <p><i>${article[0].publisher}</i></p>
        <p>${article[0].date}</p>
     </div>`
}

async function showCards(data) {
    to_add += `<div class="relatedNewsContainer">`
    for(let i = 0; i < data.length; i++) {
        
        await $.ajax({
            type: `GET`,
            url: `http://localhost:5100/getArticle/${data[i]}`,
            success: addCard
        })
    }
    to_add += `</div>`

    jQuery("main").html(to_add)
}   

function getArticle(id) {
    console.log("In getArticle")

}

async function setup () {
    to_add = ``;
    articlesId = document.getElementsByTagName("BODY")[0].id;

    console.log(articlesId)

    await $.ajax({
        type: `GET`,
        url: `http://localhost:5100/getArticles/${articlesId}`,
        success: showCards
    })
}

$(document).ready(setup)