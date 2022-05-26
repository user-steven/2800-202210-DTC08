let to_add = "";

async function removeNews(button) {
  console.log($(button).attr(`id`));
  $.ajax({
    type: `POST`,
    url: `/removeNews/${$(button).attr("id")}`,
    success: (data) => {
      window.alert(data);
      location.reload();
    },
  });
}

async function showNews(data) {
  to_add = "";
  for (let i = 0; i < data.length; i++) {
    to_add += `<div class="container">
            <h4><a href="${data[i].articleLink}"><b>${data[i].name}</b></a></h4>
            <button id="${data[i]._id}" onclick="removeNews(this);">Remove</button>
         </div>`;
    jQuery(`#${data[i]._id}`).html(to_add);
  }
}

async function showConflicts(data) {
  to_add = "";
  for (let i = 0; i < data.length; i++) {
    to_add += `<div class="container">
            <h4><a href="/conflictProfile/${data[i]._id}"><b>${data[i].conflictName}</b></a></h4>
         </div>`;
    jQuery(`#${data[i]._id}`).html(to_add);
  }
}

async function setup() {
  let articles = document.getElementsByClassName("newsLink");
  for (let i = 0; i < articles.length; i++) {
    $.ajax({
      type: `GET`,
      url: `/getArticle/${articles[i].id}`,
      success: showNews,
    });
  }

  let conflicts = document.getElementsByClassName("conflictLink");
  for (let i = 0; i < conflicts.length; i++) {
    $.ajax({
      type: `GET`,
      url: `/getConflict/${conflicts[i].id}`,
      success: showConflicts,
    });
  }

  $(".changePass").click(() => {
    $("#userUpdate").show();
    $(".passButtons").show();
    $(".changePass").hide();
  });

  $("#cancelChange").click(() => {
    $("#userUpdate").hide();
    $(".passButtons").hide();
    $(".changePass").show();
  });
}

$(document).ready(setup);
