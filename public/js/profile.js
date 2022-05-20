let to_add = ""

async function showNews(data) {
    for(let i = 0; i < data.length; i++) {
        console.log(data);
        to_add += 
        `<div class="container">
            <h4><a href="${data[0].articleLink}"><b>${data[0].name}</b></a></h4>
         </div>`
        jQuery(`#${data[0]._id}`).html(to_add)
    }
}

async function setup () {
    to_add = ``;
    let articles = document.getElementsByClassName("newsLink");
    for (let i = 0; i < articles.length; i++) {
        $.ajax({
            type: `GET`,
            url: `http://localhost:5100/getArticle/${articles[i].id}`,
            success: showNews
        })
    }
}

$(document).ready(setup)