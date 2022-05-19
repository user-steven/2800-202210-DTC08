var to_add;
var articlesId

async function addToReadLater(data) {
    var authorized;

    await $.ajax({
        type: `GET`,
        url: `http://localhost:5100/authorization`,
        success: function (response) {
            authorized = response;
        }
    })
    
    if (!authorized) {
        window.alert("Log in first");
        return;
    }

    await $.ajax({
        type: `GET`,
        url: `http://localhost:5100/getSavedNews`,
        success: function (data) {
            console.log(data)
            data.filter(function (currentValue) {
                if (currentValue == data) {
                    authorized = false;
                    return;
                }
            })
        }
    })

    if (!authorized) {
        window.alert("Article already saved to read later list.");
        return;
    }

    await $.ajax({
        type: `POST`,
        url: `http://localhost:5100/saveArticle`,
        success: function (message) {
            window.alert(message);
        }
    })
}

function addCard(article) {
    to_add += 
    `<div class="container">
        <h4><a href="${article[0].articleLink}"><b>${article[0].name}</b></a></h4>
        <p><i>${article[0].publisher}</i></p>
        <p>${article[0].date}</p>
        <button onclick="addToReadLater('${article[0]._id}');">Read Later</button>
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