const postmanRequest = require('postman-request')

const geocode = (address, callback) => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYWtvY2EiLCJhIjoiY2wwNm9jb2RrMDIyMTNqcXd5dDQ4bWxhbyJ9.h_yqnCqaujWAl31xl7EoXg&limit=1`
    postmanRequest(
        {url: geocodeUrl, json: true},
        (error, response) =>
            callback(error, response)
    )
}

module.exports = {
    geocode: geocode
}