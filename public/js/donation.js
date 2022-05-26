var confettiElement = document.getElementById("donationConfetti");
to_add = ``;

//displays the confetti when the user makes a donation over $50.00
function displayConfetti() {
  amountDonated = parseInt(document.getElementById("amountDonated").value);
  if (amountDonated >= 50) {
    if (amountDonated >= 3500) amountDonated = 3500;
    var confettiSettings = {
      target: confettiElement,
      max: amountDonated,
      size: 2,
      animate: true,
      props: ["circle", "square", "triangle", "line"],
      colors: [
        [165, 104, 246],
        [230, 61, 135],
        [0, 199, 228],
        [253, 214, 126],
      ],
      clock: 25,
      rotate: true,
      width: screen.width,
      height: document.body.scrollHeight,
      start_from_edge: false,
      respawn: true,
    };

    //the confetti variable!
    var confetti = new ConfettiGenerator(confettiSettings);

    confetti.render();
    $("#clearConfettiButton").show()
    clearConfettiButton.onclick = function () {
      location.reload();
    };
  }
}

//populates variables for an insertion into the donation log database
function populateHistory() {
  charityName = $("#charityName").val();
  dateDonated = $("#dateDonated").val();
  amountDonated = $("#amountDonated").val();

  log = `
    <tr>
        <td>${charityName}</td>
        <td>${dateDonated}</td>
        <td>${amountDonated}</td>
    </tr>
    `;
  document.getElementById("eventContainer").innerHTML += log;
  insertDonation(charityName, dateDonated, amountDonated);
}

//inserts the given parameters into the donation log database
function insertDonation(name, date, amount) {
  $.ajax({
    type: "POST",
    url: "/insert",
    data: {
      charityName: name,
      dateDonated: date,
      amountDonated: amount,
    },
    success: displayConfetti(),
  });
}

//displays the events in the donation log database
function showTimeline(data) {

  if (data == `not logged in`) {
    to_add = `log in first`;
  } else if (data.length == 0) {
    to_add = `no events`;
  } else {
    for (let i = 0; i < data.length; i++) {
      to_add += `<tr>
                 <td>${data[i].charityName}</td>
                 <td>${data[i].dateDonated}</td>
                 <td>${data[i].amountDonated}</td>
             </tr>`;
    }
  }
  document.getElementById("eventContainer").innerHTML += to_add;
}

//sets the max donation date to the current day
function maxDonationDate() {
  const today = new Date().toLocaleDateString("en-ca")
  document.getElementById("dateDonated").setAttribute("max", today)
}

//setup function called on page load
async function setup() {

  $("#clearConfettiButton").hide()

  await $.ajax({
    type: `GET`,
    url: `/getUser`,
    success: showTimeline,
  });

  maxDonationDate()
}

jQuery(document).ready(setup);
