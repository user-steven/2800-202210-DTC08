var to_add;
var articlesId;

async function authorize() {
  var authorized;
  await $.ajax({
    type: `GET`,
    url: `/authorization`,
    success: function (response) {
      authorized = response;
      return;
    },
  });
  return authorized;
}

async function checkDuplicates(id, route) {
  var authorized = true;
  await $.ajax({
    type: `GET`,
    url: `/${route}`,
    success: function (data) {
      data.filter(function (currentValue) {
        if (currentValue == id) {
          authorized = false;
          return;
        }
      });
    },
  });
  return authorized;
}

async function watchConflict(id) {
  if (!(await authorize())) {
    window.alert("Log in first");
    return;
  }

  if (!(await checkDuplicates(id, "getSavedConflicts"))) {
    await $.ajax({
      type: `POST`,
      url: `/removeConflict/${id}`,
      success: function (message) {
        window.alert(message);
      },
    });
    return;
  }

  await $.ajax({
    type: `POST`,
    url: `/saveConflict/${id}`,
    success: function (message) {
      window.alert(message);
    },
  });
}

async function addToReadLater(id) {
  if (!(await authorize())) {
    window.alert("Log in first");
    return;
  }

  if (!(await checkDuplicates(id, "getSavedNews"))) {
    window.alert("Article already saved to read later list.");
    return;
  }

  await $.ajax({
    type: `POST`,
    url: `/saveArticle/${id}`,
    success: function (message) {
      window.alert(message);
    },
  });
}

async function showCards(data) {
  to_add += `<div class="relatedNewsContainer">`;
  for (let i = 0; i < data.length; i++) {
    await $.ajax({
      type: `GET`,
      url: `/getArticle/${data[i]}`,
      success: function (article) {
        to_add += `<div class="container">
                    <h4><a href="${article[0].articleLink}"><b>${article[0].name}</b></a></h4>
                    <p><i>${article[0].publisher}</i></p>
                    <p>${article[0].date}</p>
                    <br>
                    <button class="later" onclick="addToReadLater('${article[0]._id}');">Read Later</button>
                 </div>`;
      },
    });
  }
  to_add += `</div>`;
  jQuery("main").html(to_add);
}

async function setup() {
  to_add = ``;
  articlesId = document.getElementsByTagName("BODY")[0].id;

  await $.ajax({
    type: `GET`,
    url: `/getArticles/${articlesId}`,
    success: showCards,
  });
}

$(document).ready(setup);
