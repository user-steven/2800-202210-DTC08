const country = {
  ukraine: [31.1656, 48.3794],
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

    if (countryName == "ukraine") {
      map.events.add("click", key, () => {
        window.location.href = "/conflictProfile/russia-ukraine-war";
      });
    }
  }
});

// News photos gallery
//     I found this code on https://www.w3schools.com/
//     @author contribute@w3schools.com
//     @see https://www.w3schools.com/howto/howto_js_slideshow.asp

let slideIndex = 0;
newsSlides();

function newsSlides() {
  let i;
  let slides = document.getElementsByClassName("newsSlides");
  let pages = document.getElementsByClassName("page");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < pages.length; i++) {
    pages[i].className = pages[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  pages[slideIndex - 1].className += " active";
  setTimeout(newsSlides, 3000); // Change image every 3 seconds
}
