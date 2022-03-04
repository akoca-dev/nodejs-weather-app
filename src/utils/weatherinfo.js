const postmanRequest = require('postman-request')

const weatherInfo = (longitute, latitude, callback) => {
    const weatherAppUrl = `http://api.weatherstack.com/current?access_key=eedcc1c52e4e832dca595914c34f92ce&query=${encodeURIComponent(latitude)},${encodeURIComponent(longitute)}&units=m&lang=en-US`

    postmanRequest(
        {url: weatherAppUrl, json: true},
        (error, response) => callback(error, response)
    )
}

module.exports = {
    weatherInfo: weatherInfo
}