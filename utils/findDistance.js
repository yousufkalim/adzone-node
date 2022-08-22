/**
 *  Find Distance
 * @codeby Shuja Naqvi
 */

exports.findNearByStores = async (latitude, longitude, stores) => {
  try {
    var R = 6371;
    var Stores = [];
    var tempStore = [];
    const lat2 = parseFloat(latitude);
    const lon2 = parseFloat(longitude);
    for (var i = 0; i < stores.length; i++) {
      console.log(stores[i], 'stores[i]');
      for (var j = 0; j < stores[i].storeData.length; j++) {
        var lat1 = stores[i].storeData[j].location.lat;
        var lon1 = stores[i].storeData[j].location.lng;
        var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
        var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
        var a = parseFloat(
          0.5 -
            Math.cos(dLat) / 2 +
            (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2
        );
        var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
        tempStore.push({
          store: stores[i].storeData[j]._id,
          brand: stores[i].storeData[j].brand._id,
          distance: distance,
        });
      }
      let max = tempStore.reduce(function (prev, current) {
        return prev.distance > current.distance ? prev : current;
      }); //returns object
      Stores.push(max);
      max = '';
      tempStore = [];
    }
    return Stores;
  } catch (err) {
    console.log(err.message);
  }
};
//One Brand With Multiple stores
exports.findStores = async (latitude, longitude, stores) => {
  try {
    var R = 6371;
    var nearByStores = [];
    lat2 = parseFloat(latitude);
    lon2 = parseFloat(longitude);
    for (var i = 0; i < stores.length; i++) {
      if (stores[i]?.location?.lat && stores[i]?.location?.lng) {
        var lat1 = stores[i].location.lat;
        var lon1 = stores[i].location.lng;
        var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
        var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
        var a = parseFloat(
          0.5 -
            Math.cos(dLat) / 2 +
            (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2
        );
        var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
        var payload = { distance: distance, store: stores[i] };
        nearByStores.push(payload);
      }
    }

    return nearByStores;
  } catch (err) {
    console.log(err.message);
  }
};

//Multiple Brand With Multiple stores

exports.findBrandStore = async (latitude, longitude, brands) => {
  try {
    var R = 6371;
    var Stores = [];
    var tempStore = [];
    lat2 = parseFloat(latitude);
    lon2 = parseFloat(longitude);
    for (var h = 0; h < brands.length; h++) {
      let brand = brands[h];
      for (var i = 0; i < brand.stores.length; i++) {
        var lat1 = brand.stores[i].location.lat;
        var lon1 = brand.stores[i].location.lng;
        var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
        var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
        var a = parseFloat(
          0.5 -
            Math.cos(dLat) / 2 +
            (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2
        );
        var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
        tempStore.push({
          store: brand.stores[i],
          brand: brand,
          distance: distance,
        });
      }
      let max = tempStore.reduce(function (prev, current) {
        return prev.distance <= current.distance ? prev : current;
      }); //returns object
      Stores.push(max);
      max = '';
      tempStore = [];
    }

    return Stores;
  } catch (err) {
    console.log(err.message);
  }
};

exports.findMybrandStores = async (latitude, longitude, stores) => {
  try {
    var R = 6371;
    var Stores = [];
    var tempStore = [];
    const lat2 = parseFloat(latitude);
    const lon2 = parseFloat(longitude);
    for (var i = 0; i < stores.length; i++) {
      var lat1 = stores[i].location.lat;
      var lon1 = stores[i].location.lng;
      var dLat = parseFloat(((lat2 - lat1) * Math.PI) / 180); // deg2rad below
      var dLon = parseFloat(((lon2 - lon1) * Math.PI) / 180);
      var a = parseFloat(
        0.5 -
          Math.cos(dLat) / 2 +
          (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2
      );
      var distance = parseFloat(R * 2 * Math.asin(Math.sqrt(a)));
      console.log(distance, 'distance');
      tempStore.push({
        distance: distance,
        store: stores[i],
      });
    }
    let max = tempStore.reduce(function (prev, current) {
      return prev.distance > current.distance ? prev : current;
    }); //returns object

    return max;
  } catch (err) {
    console.log(err.message);
  }
};
