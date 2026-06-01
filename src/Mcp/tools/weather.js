const axios = require("axios");

async function getWeather(city) {

    try {
        const response =
            await axios.get(`https://wttr.in/${city}?format=j1`);
            const data =response.data;
            return {
                city: city,
                temperature:data.current_condition[0].temp_C + "°C",
                description:data.current_condition[0].weatherDesc[0].value,
                humidity:data.current_condition[0].humidity,
                windSpeed:data.current_condition[0].windspeedKmph + " km/h"
            };
        }
        catch (error) {
            return {
                error:"Weather service unavailable"
            };
        }
}

module.exports = getWeather;