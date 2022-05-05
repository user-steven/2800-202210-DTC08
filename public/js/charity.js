function processCharity(data) {
    charities = data
    console.log(charities)
    for (i=0; i<charities.length; i++) {
        let name = charities[i].charityName
        let website = charities[i].websiteURL
        document.getElementById("charityList").innerHTML += `<li><a href="${website}">${name}</a></li>`
    }
    
}

async function obtainCharity() {
    $("#charityList").empty()
    let category = document.querySelector("#charityCategories").value
    let searchTerm = document.querySelector("#searchTerm").value
    // console.log(category)
    // console.log(searchTerm)

    await $.ajax({
        type: "GET",
        url: `https://api.data.charitynavigator.org/v2/Organizations?app_id=ca5f22b2&app_key=a8488024fb5d86865fccb647c208c5ab&pageSize=10&search=${searchTerm}&rated=true&categoryID=${category}&sort=RATING%3ADESC`,
        success: processCharity 
    })

}

function setup () {
    document.getElementById("searchCharityButton").addEventListener("click", obtainCharity)
}

$(document).ready(setup)
