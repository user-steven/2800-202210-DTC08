to_add = ``;

function showTimeline(data) {
  console.log(data);

  if (data == `not logged in`) {
    to_add = `log in first`;
  } else if (data.length == 0) {
    to_add = `no events`;
  } else {
    to_add = `
                    <br>
                    <table class="eventContainer">
                     <tr>
                        <th>Charity Name</th>
                        <th>Date Donated</th>
                        <th>Amount Donated</th>
                     </tr>`;
    for (let i = 0; i < data.length; i++) {
      to_add += `<tr>
                 <td>${data[i].charityName}</td>
                 <td>${data[i].dateDonated}</td>
                 <td>${data[i].amountDonated}</td>
             </tr>`;
    }
    to_add += `</table>`;
  }
  jQuery("main").html(to_add);
}

async function setup() {
  await $.ajax({
    type: `GET`,
    url: `http://localhost:5100/getUser`,
    success: showTimeline,
  });
}

jQuery(document).ready(setup);
