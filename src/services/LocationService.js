async function geoLookup(lat, lon){
    const response = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${process.env.geo_api_key}`);

    return await response.json();
}

module.exports = geoLookup;