const country = {
  Ukraine: [31.1656, 48.3794],
  Afghanistan: [67.71, 33.9391],
  Ethiopia: [40.4897, 9.145],
  Mexico: [-99.133209, 19.432608],
  Yemen: [48.5164, 15.5527],
};

//Initialize a map instance.
var map = new atlas.Map("map", {
  //Only allow one copy of the world be rendered when zoomed out.
  view: "Auto",
  //Add your Azure Maps subscription client ID to the map SDK.
  authOptions: {
    authType: "subscriptionKey",
    subscriptionKey: "g-8bmjcGR3kIo2GsHB5DCF4_rljQxKjAvE3ILRsmF_Q",
  },
});

//Wait until the map resources are ready.
map.events.add("ready", function () {
  for (var key in country) {
    countryName = key;

    var key = new atlas.HtmlMarker({
      position: country[key],
      pixelOffset: [6, -15],
      draggable: false,
    });

    map.markers.add(key);

    if (countryName == "Ukraine") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/6282894d67554247b5f3d3f1";
      });
    } else if (countryName == "Mexico") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/6286dafbea8ab7a4dc96bfe5";
      });
    } else if (countryName == "Ethiopia") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/6286dafbea8ab7a4dc96bfe4";
      });
    } else if (countryName == "Yemen") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/6286dafbea8ab7a4dc96bfe6";
      });
    } else if (countryName == "Afghanistan") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/6286d784ea8ab7a4dc96bfde";
      });
    }
  }
});

// News photos gallery
//     I found this code on https://www.w3schools.com/
//     @author contribute@w3schools.com
//     @see https://www.w3schools.com/howto/howto_js_slideshow.asp

let newsIndex = 0;
newsSlides();

function newsSlides() {
  let i;
  let slides = document.getElementsByClassName("newsSlides");
  let pages = document.getElementsByClassName("page");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  newsIndex++;
  if (newsIndex > slides.length) {
    newsIndex = 1;
  }
  for (i = 0; i < pages.length; i++) {
    pages[i].className = pages[i].className.replace(" active", "");
  }
  slides[newsIndex - 1].style.display = "block";
  pages[newsIndex - 1].className += " active";
  setTimeout(newsSlides, 3000); // Change image every 3 seconds
}

function getNewsArticles() {
  $.ajax({
    type: "GET",
    url: "/findTopTenArticles",
    success: result => displayTopNewsArticles(result)
  })
}

function displayTopNewsArticles(data) {
  // console.log(data)

  relatedNewsContainer = document.getElementById('relatedNewsContainer')

  for (i = 0; i < data.length; i++) {
    articleLink = data[i].articleLink
    articleName = data[i].name
    articlePublisher = data[i].publisher
    articleDate = data[i].date

    console.log(`${articleLink} ${articleName}${articlePublisher}${articleDate}`)
    card =
      `
      <div class="news_cards">
        <div class="container">
          <h4><a href="${articleLink}"><b>${articleName}</b></a></h4>
          <p><i>${articlePublisher}</i></p>
          <p>${articleDate}</p>
        </div>
      </div>
    `
    relatedNewsContainer.insertAdjacentHTML( 'beforeend', card )
  }
}


getNewsArticles()