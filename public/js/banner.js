function loadSkeleton() {
  $("#banner").load("./template/banner.ejs")
}

loadSkeleton()

//     I found this code on https://www.w3schools.com/
//     @author contribute@w3schools.com
//     @see https://www.w3schools.com/howto/howto_js_slideshow.asp

let slideIndex = 2;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

  function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  $(slides[slideIndex-1]).css("display", "block");  
  dots[slideIndex-1].className += " active";
}