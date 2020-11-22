setup = (lat, lon) => {
  // Setup() hämtar in Lat och Lon för sedan skicka det till DefaultCity() så vi kan på startsidan få vilken stad vi är nuvarande
  const loading = document.querySelector('.loader');
  const weatherContainer = document.querySelector('.weather-container');

  getDefaultCity(lat, lon, loading).then(res => {
    buildCityName(res.city_name);
    buildWeatherIcon(res.icon);
    buildWeatherDescription(res.description);
    buildWeatherDegree(res.degree);
    buildWeatherSpeed(res.windSpeed);

    loading.classList.remove('show');
    loading.classList.add('hide');
    weatherContainer.classList.remove('hide');
    weatherContainer.classList.add('show');

  })
  // när man skriver ny stad aktiveras denna (få gå söka till formField())
  formField()
}

getDefaultCity = async (lat, lon, loading) => {
  const apiKey = '';
  loading.classList.remove('hide');
  loading.classList.add('show');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=se&units=metric&appid=${apiKey}`;
  let response = await fetch(url);
  //Error hantering ifall vi stöter på nåt otrevligt
  try {
    if (response.status >= 200 && response.status < 300) {
      let convertToJson = await response.json();

      return {
        description: convertToJson.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${convertToJson.weather[0].icon}.png`,
        windSpeed: convertToJson.wind.speed,
        degree: convertToJson.main.temp,
        humidity: convertToJson.main.humidity,
        city_name: convertToJson.name
      }
    }
    else if (response.status === 401 || response.status === 404) {
      throw (response.statusText);
    }
    else {
      
      throw (response.statusText);
    }
  }
  catch (error) {
    console.error(error);
  }
}

fetchCityValue = (city) => {
  getNewCityInformation(city).then(res => {
    buildCityName(res.city_name)
    buildWeatherIcon(res.icon);
    buildWeatherDescription(res.description);
    buildWeatherDegree(res.degree);
    buildWeatherSpeed(res.windSpeed);
    buildCityCompare(res).then(compare => {
      const cityCompareText = document.querySelector('.compare-malmoe-with-city p');
      // Har ingen catch i denna för vi kommer alltid få rätt stad (malmö)
      // Däremot använder jag Math.abs() för omvandla - till + för vi måste säga att det är + skillnad.

      let city = compare.compare_degree_city;
      let malmo = compare.compare_degree_malmo;

      const differenceBetweenCity = Math.abs(Math.round(malmo) - Math.round(city));
      if (compare.city === 'Malmo') {
        return cityCompareText.textContent = 'Jämför du samma stad?'
      }
      return cityCompareText.textContent = `Skilland mellan Malmö och ${compare.city} är: ${differenceBetweenCity} i grader`
    })

    const weatherContainer = document.querySelector('.weather-container');
    const loading = document.querySelector('.loader');

    loading.classList.remove('show');
    loading.classList.add('hide');
    weatherContainer.classList.remove('hide');
    weatherContainer.classList.add('show');
  });
}

formField = () => {
  //Hämta input från formulär av classnamn .weather-form
  const form = document.querySelector('.weather-form');

  form.addEventListener('submit', (e) => {
    // från form.addEventListener('submit', formSubmited) hämtar vi värdet och returnerar det tillbaka till FetchCityValue.
    e.preventDefault();
    let city = e.target.city.value;
    return fetchCityValue(city);
  })
}

getNewCityInformation = async (city) => {
  const apiKey = '';
  const loading = document.querySelector('.loader');
  const error = document.querySelector('.error');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=se&units=metric&appid=${apiKey}`;
  let response = await fetch(url);
  // Samma sak som DefaultCity(), error hantering för här kan det verkligen hända nåt!
  try {
    if (response.status >= 200 && response.status < 300) {
      let convertToJson = await response.json();
      loading.classList.remove('hide');
      loading.classList.add('show');
      error.classList.remove('show')
      error.classList.add('hide')
      return {
        description: convertToJson.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${convertToJson.weather[0].icon}.png`,
        windSpeed: convertToJson.wind.speed,
        degree: convertToJson.main.temp,
        humidity: convertToJson.main.humidity,
        city_name: convertToJson.name
      }
    }
    else if (response.status === 401 || response.status === 404) {
      if(error.classList.contains('show')) {
        error.classList.remove('show');
        error.classList.add('hide');

      }
      else if(error.classList.contains('hide')) {
        error.classList.remove('hide')
        error.classList.add('show');
      }
      else {
        error.classList.remove('hide')
        error.classList.add('show');
      }
      throw (error.textContent = response.statusText);
    }
    else {
      if(error.classList.contains('show')) {
        error.classList.remove('show');
        error.classList.add('hide');

      }
      else if(error.classList.contains('hide')) {
        error.classList.remove('hide')
        error.classList.add('show');
      }
      else {
        error.classList.remove('hide')
        error.classList.add('show');
      }
      throw (error.textContent = response.statusText);
    }
  }
  catch (error) {
    console.error(error);
  }
}

/** Början av uppbyggning */
buildCityName = (cityName) => {
  const cityNameText = document.querySelector('.city p');
  cityNameText.textContent = cityName;
}

buildWeatherIcon = (icon) => {
  const img = document.querySelector('.weather-type-icon img');
  img.setAttribute('src', icon);
}

buildWeatherDescription = (description) => {
  const weatherDescriptionText = document.querySelector('.weather-description p');
  weatherDescriptionText.textContent = description;
}

buildWeatherDegree = (degree) => {
  weatherClassAdd(degree);
  degree = `${Math.round(degree)}°c`;
  const weatherDegreeText = document.querySelector('.weather-degree p');
  weatherDegreeText.textContent = degree;
}

buildWeatherSpeed = (weatherSpeed) => {
  const weatherSpeedText = document.querySelector('.weather-speed p');
  weatherSpeedText.textContent = `${weatherSpeed}m/s`;
}

buildCityCompare = async (city) => {
  // Här jämför vi Malmö mot stad som vi plockade in innan och sparar om de som ett nytt object.
  // Vet inte om detta är bästa sätt men känns okay för mig.
  const apiKey = '212514b52ee74f93d002ad15b350fc09';
  let url = `https://api.openweathermap.org/data/2.5/weather?q=malmö&lang=se&units=metric&appid=${apiKey}`;
  let response = await fetch(url);
  let convertToJson = await response.json();
  return {
    city: city.city_name,
    compare_degree_malmo: convertToJson.main.temp,
    compare_degree_city: city.degree,
  }
}

/** Slut på uppbyggnad  */

weatherClassAdd = (weatherDegree) => {
  // Väder check så ifall det är viss temperatur ute då byter vi färg på texten
  // Har också skrivit in kontroll om viss klass existeras ta bort de och sedan ersätt med nya klass.
  const weatherContainer = document.querySelector('.weather-container');
  if (weatherDegree <= 10) {
    if (weatherContainer.classList.contains('warm-weather')) {
      weatherContainer.classList.remove('warm-weather');
    }
    else if (weatherContainer.classList.contains('decent-weather')) {
      weatherContainer.classList.remove('decent-weather');
    }
    weatherContainer.classList.add('cold-weather');
  }
  else if (weatherDegree >= 20) {
    if (weatherContainer.classList.contains('cold-weather')) {
      weatherContainer.classList.remove('cold-weather');
    }
    else if (weatherContainer.classList.contains('decent-weather')) {
      weatherContainer.classList.remove('decent-weather');
    }
    weatherContainer.classList.add('warm-weather');
  }

  else {
    if (weatherContainer.classList.contains('cold-weather')) {
      weatherContainer.classList.remove('cold-weather');
    }
    else if (weatherContainer.classList.contains('warm-weather')) {
      weatherContainer.classList.remove('warm-weather');
    }
    weatherContainer.classList.add('decent-weather');
  }
}

getCords = () => {
  // Här hämtar vi vår geolocation (Lat + Lon) sedan när vi har sparat ner de skickar vi de till setup() som kommer bygga upp allt åt oss
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      return setup(latitude, longitude)
    });
  }
}

//Aktivera getCords
getCords();