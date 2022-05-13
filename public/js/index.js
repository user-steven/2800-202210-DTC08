const country = {
    "ukraine": [31.1656, 48.3794],
    "Afghanistan": [67.7100, 33.9391],
    "Ethiopia": [40.4897, 9.1450],
    "Mexico": [-99.133209, 19.432608],
    "Yemen": [48.5164, 15.5527]
}


//Initialize a map instance.
var map = new atlas.Map('map', {
    //Only allow one copy of the world be rendered when zoomed out.
    renderWorldCopies: false,
    view: "Auto",
    //Add your Azure Maps subscription client ID to the map SDK.
    authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: 'g-8bmjcGR3kIo2GsHB5DCF4_rljQxKjAvE3ILRsmF_Q'
    }
});

//Wait until the map resources are ready.
map.events.add('ready', function () {
    for (var key in country) {
        var key = new atlas.HtmlMarker({
            position: country[key],
            pixelOffset: [6, -15],
            draggable: false,
        })

        map.markers.add(key)
        map.events.add('click', key, () => {
            window.location.href = '/news'
        })
    }
});
