const axios = require('axios');

const API_KEY_AREA = process.env.GOOGLE_API_KEY_AREA;
const API_KEY = process.env.GOOGLE_API_KEY;
exports.address = async (req, res) => {
  try {
    let { text } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}`;
    let results = await axios.get(url);

    let placeIds = results.data.predictions.map(i => i.place_id);

    let places = placeIds.map(item =>
      axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item}&fields=name%2Cformatted_address%2Cgeometry&key=${API_KEY}`
      )
    );

    places = (await Promise.all(places)).map(item => item.data.result);

    places = places.map(item => {
      return {
        area: item.formatted_address,
        ...item.geometry.location
      };
    });

    res.json({ success: true, results: places });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getArea = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY_AREA}&latlng=${lat},${lng}&sensor=true/false`;
    let results = await axios.get(url);
    return res.json({
      success: true,
      address: {
        area: results?.data?.plus_code?.compound_code ? results.data.plus_code.compound_code : '',
        lat: lat,
        lng: lng,
        city: results?.data?.plus_code?.compound_code
          ? results.data.plus_code.compound_code.split(',')[1]
          : ''
      }
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
