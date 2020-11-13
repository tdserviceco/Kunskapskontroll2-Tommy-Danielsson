setup = () => {
  //Upplägg allting
  formSubmit()
}

formSubmit = () => {
  const form = document.querySelector('form');
  const loading = document.querySelector('.loading');
  const errorField = document.querySelector('.error');
  const cityCompareBlock = document.querySelector('.city-compare');
  const cityCompareText = document.querySelector('.city-compare p');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    errorField.classList.add('hide');
    loading.classList.remove('hide');
    let city = (e.target.city.value);
    fetchCity(city).then(success => {
      buildDescription(success.description, success.icon);
      buildDegree(success.degree);
      buildHumidity(success.humidity);
      buildWindSpeed(success.windSpeed);

      buildCityCompare(success).then(response => {
        cityCompareBlock.classList.remove('hide');
        let city = Math.round(response.compare_degree_city)
        let malmo = Math.round(response.compare_degree_malmo)
        const differenceBetweenCity = Math.abs(city - malmo);

        cityCompareText.textContent = '';
        if (response.city === 'Malmo') {
          return cityCompareText.textContent = 'Jämför du samma stad?'
        }

        return cityCompareText.textContent = `Skilland mellan Malmö och ${response.city} är: ${differenceBetweenCity} i grader`
      }).catch(cityDoesntExist => {
        console.error(cityDoesntExist)
      })

      loading.classList.add('hide');
    }).catch(issues => {
      cityCompareBlock.classList.add('hide');
      errorField.classList.remove('hide');
      console.error(issues);
    })

  })
}

fetchCity = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=sv&appid=212514b52ee74f93d002ad15b350fc09`;
  let response = await fetch(url);
  let convertJson = await response.json();
  console.log(convertJson)
  return {
    description: convertJson.weather[0].description,
    icon: `http://openweathermap.org/img/wn/${convertJson.weather[0].icon}.png`,
    windSpeed: convertJson.wind.speed,
    degree: convertJson.main.temp - 273.15,
    humidity: convertJson.main.humidity,
    city_name: convertJson.name
  }
}

buildDescription = (description, icon) => {
  const descriptionBlock = document.querySelector('.description');
  descriptionBlock.classList.add('hide');
  const descriptionText = document.querySelector('.description .grid-left');
  const descriptionTextValue = document.querySelector('.description .grid-right .weather-type');

  const img = document.querySelector('.description img');
  descriptionText.textContent = '';
  descriptionText.textContent = 'Väder:';
  descriptionTextValue.textContent = '';
  descriptionTextValue.textContent = description
  img.setAttribute('src', icon)
  descriptionBlock.classList.remove('hide');
}



buildHumidity = (humidity) => {
  const humidityBlock = document.querySelector('.humidity');
  humidityBlock.classList.add('hide');
  const humidityText = document.querySelector('.humidity .grid-left');
  const humidityTextValue = document.querySelector('.humidity .grid-right');

  humidityBlock.classList.remove('hide');
  humidityText.textContent = '';
  humidityText.textContent = 'Fuktighet: ';
  humidityTextValue.textContent = '';
  humidityTextValue.textContent = `${humidity}%`;
}

buildDegree = (degree) => {
  const degreeBlock = document.querySelector('.degree');
  degreeBlock.classList.add('hide');
  const degreeText = document.querySelector('.degree .grid-left');
  const degreeTextValue = document.querySelector('.degree .grid-right');

  degreeBlock.classList.remove('hide');
  weatherClassAdd(degreeBlock, degree);
  degree = `${Math.round(degree)}°c`;
  degreeText.textContent = '';
  degreeText.textContent = 'Värme: ';

  degreeTextValue.textContent = '';
  degreeTextValue.textContent = degree

}

buildWindSpeed = (windSpeed) => {
  const windSpeedBlock = document.querySelector('.wind-speed');
  windSpeedBlock.classList.add('hide');
  const windSpeedText = document.querySelector('.wind-speed .grid-left');
  const windSpeedTextValue = document.querySelector('.wind-speed .grid-right');

  windSpeedBlock.classList.remove('hide');
  windSpeedText.textContent = '';
  windSpeedText.textContent = 'Vindhastighet: ';

  windSpeedTextValue.textContent = '';
  windSpeedTextValue.textContent = `${windSpeed} kmph`;

}

buildCityCompare = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=malmö&appid=212514b52ee74f93d002ad15b350fc09`;
  let response = await fetch(url);
  let convertJson = await response.json();
  return {
    city: city.city_name,
    compare_degree_malmo: convertJson.main.temp - 273.15,
    compare_degree_city: city.degree,
  }
}

weatherClassAdd = (degreeBlock, weatherDegree) => {
  if (Math.round(weatherDegree) >= 20) {
    return degreeBlock.classList.add('warm-weather');
  }
  else if (Math.round(weatherDegree) <= 10) {
    return degreeBlock.classList.add('cold-weather');
  }
  else {
    return degreeBlock.classList.add('decent-weather');
  }
}

setup();