const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require("./utils/geocode")
const weatherInfo = require("./utils/weatherinfo")


const VIEW_ENGINE = 'view engine'
const VIEW_ENGINE_HBS = 'hbs'
const VIEWS = 'views'
const VIEWS_DIR = '../templates/views'
const PARTIALS_DIR = '../templates/partials'
const PAGES_INDEX = 'index'
const PAGES_ABOUT = 'about'
const PAGES_HELP = 'help'
const PAGES_HELP_NOTFOUND = 'help-notfound'
const PAGES_NOTFOUND = 'notfound'
const ROUTES_ROOT = ''
const ROUTES_ABOUT = '/about'
const ROUTES_HELP = '/help'
const ROUTES_FALLBACK = '*'

const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, VIEWS_DIR)
const partialssDirPath = path.join(__dirname, PARTIALS_DIR)

const port = process.env.PORT || 3000

const app = express()
app.set(VIEW_ENGINE, VIEW_ENGINE_HBS)
app.set(VIEWS, viewsDirPath)
app.use(express.static(publicDirPath))

hbs.registerPartials(partialssDirPath)

app.get(ROUTES_ROOT, (req, res) => {
    res.render(PAGES_INDEX, {
        title: 'Weather App',
        name: 'akoca'
    })
})

app.get(ROUTES_ABOUT, (req, res) => {
    res.render(PAGES_ABOUT ,{
        title: 'Weather App',
        name: 'akoca'
    })
})

app.get(ROUTES_HELP, (req, res) => {
    res.render(PAGES_HELP ,{
        title: 'Weather App',
        helpMessage: 'Your request is being processed',
        name: 'akoca'
    })
})

app.get('/weather', (req, res) => {

    const query = req.query;

    if(!query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode.geocode(query.address, (error, {body} = {}) => {
        if (error || body.features.length === 0) {
            console.log('Unable to get geolocation data')
            return res.send({
                error: 'Unable to get geolocation data'
            })
        }
    
        const geocodeData = body.features[0]
        console.log(`Istanbul longitude: ${geocodeData.center[0]}, latitude: ${geocodeData.center[1]}`)
    
        weatherInfo.weatherInfo(geocodeData.center[0], geocodeData.center[1], (error, {body} = {}) => {
            if (error || body.error) {
                console.log('Unable to get weather data')
                return res.send({
                    error: 'Unable to get weather data'
                })
            }
        
            const foreCastData = body.current
            const locationData = body.location
            console.log(`${foreCastData.weather_descriptions[0]}. It is currently ${foreCastData.temperature} degree but feels like ${foreCastData.feelslike}`)
            res.send({
                forecast: foreCastData.weather_descriptions[0],
                temperature: foreCastData.temperature,
                feelslike: foreCastData.feelslike,
                location: `${locationData.name} ${locationData.country} ${locationData.region} ${locationData.timezone_id} `,
                address: query.address
            })

        })
    })
})

app.get(ROUTES_HELP + '/' + ROUTES_FALLBACK, (req, res) => {
    res.render(PAGES_HELP_NOTFOUND, {
        title: 'Weather App',
        name: 'akoca',
        helpNotfoundMessage: 'Help article not found'
    })
})

app.get(ROUTES_FALLBACK, (req, res) => {
    res.render(PAGES_NOTFOUND, {
        title: 'Weather App',
        name: 'akoca',
        pageNotfoundMessage: '404 not found'
    })
})

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})