const objects = {
  // Min variant av globala variabel
  descriptionBlock: document.querySelector('.description'),
  descriptionText: document.querySelector('.description .grid-left'),
  descriptionTextValue: document.querySelector('.description .grid-right .weather-type'),
  descriptionImg: document.querySelector('.description img'),


  humidityBlock: document.querySelector('.humidity'),
  humidityText: document.querySelector('.humidity .grid-left'),
  humidityTextValue: document.querySelector('.humidity .grid-right'),

  degreeBlock: document.querySelector('.degree'),
  degreeText: document.querySelector('.degree .grid-left'),
  degreeTextValue: document.querySelector('.degree .grid-right'),

  windSpeedBlock: document.querySelector('.wind-speed'),
  windSpeedText: document.querySelector('.wind-speed .grid-left'),
  windSpeedTextValue: document.querySelector('.wind-speed .grid-right'),

  errorBlock: document.querySelector('.error'),
  errorBlockText: document.querySelector('.error p'),

  form: document.querySelector('form'),
  loading: document.querySelector('.loading'),

  cityCompareBlock: document.querySelector('.city-compare'),
  cityCompareText: document.querySelector('.city-compare p'),

}

setup = () => {
  //Upplägg allting
  formSubmit()
}


formSubmit = () => {
  // Vid submit (när man trycker på knappen hämta) börjar vi bygga upp allt men tills ALLT är uppbyggt visar vi en "hämtar..." text (med liten animation)
  objects.form.addEventListener('submit', (e) => {
    e.preventDefault();
    objects.errorBlock.classList.add('hide');
    objects.loading.remove('hide');
    let city = (e.target.city.value);
    fetchCity(city).then(success => {
      buildDescription(success.description, success.icon);
      buildDegree(success.degree);
      buildHumidity(success.humidity);
      buildWindSpeed(success.windSpeed);

      buildCityCompare(success).then(response => {
        // Har ingen catch i denna för vi kommer alltid få rätt stad (malmö)
        // Däremot använder jag Math.abs() för omvandla - till + för vi måste säga att det är + skillnad.
        objects.cityCompareBlock.classList.remove('hide');
        let city = Math.round(response.compare_degree_city)
        let malmo = Math.round(response.compare_degree_malmo)
        const differenceBetweenCity = Math.abs(city - malmo);

        objects.cityCompareText.textContent = '';
        if (response.city === 'Malmo') {
          return objects.cityCompareText.textContent = 'Jämför du samma stad?'
        }

        return objects.cityCompareText.textContent = `Skilland mellan Malmö och ${response.city} är: ${differenceBetweenCity} i grader`
      });
      objects.loading.classList.add('hide');
    }).catch(issues => {
      console.error('message: ', issues)
    });
  })
}

fetchCity = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=sv&appid=212514b52ee74f93d002ad15b350fc09`;
  let response = await fetch(url);
  let convertJson = await response.json();

  // Här kollar vi om vi kan få ut rätt stad eller inte, vid fel-kod 404 visa att stad existerar inte.
  if (convertJson.cod === '404') {
    objects.descriptionBlock.classList.add('hide');
    objects.humidityBlock.classList.add('hide');
    objects.degreeBlock.classList.add('hide');
    objects.windSpeedBlock.classList.add('hide');
    objects.cityCompareBlock.classList.add('hide')
    objects.errorBlock.classList.remove('hide')
    objects.errorBlockText.textContent = '';
    objects.errorBlockText.textContent = 'Stad existerar inte';
  }

  //När vi har fått ut rätt stad börjar vi plocka in som ett object och returnerar tillbaka till fetchCity().then(success)

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

  // Bygger upp här själva väder situation grid (molnigt, regn etc) med ikon på köpet
  objects.descriptionBlock.classList.remove('show');
  objects.descriptionBlock.classList.add('hide');

  objects.descriptionText.textContent = '';
  objects.descriptionText.textContent = 'Väder:';

  objects.descriptionTextValue.textContent = '';
  objects.descriptionTextValue.textContent = description

  objects.descriptionImg.setAttribute('src', icon)

  objects.descriptionBlock.classList.remove('hide');
  objects.descriptionBlock.classList.add('show');
}


buildDegree = (degree) => {
  // Bygger upp temperatur grid

  objects.degreeBlock.classList.remove('show');
  objects.degreeBlock.classList.add('hide');
  objects.degreeBlock.classList.remove('hide');
  objects.degreeBlock.classList.add('show');

  weatherClassAdd(degree);
  degree = `${Math.round(degree)}°c`;
  objects.degreeText.textContent = '';
  objects.degreeText.textContent = 'Temperatur: ';

  objects.degreeTextValue.textContent = '';
  objects.degreeTextValue.textContent = degree

}

buildHumidity = (humidity) => {
  // Bygger upp fuktighets grid
  objects.humidityBlock.classList.remove('show');
  objects.humidityBlock.classList.add('hide');

  objects.humidityBlock.classList.remove('hide');
  objects.humidityBlock.classList.add('show');
  objects.humidityText.textContent = '';
  objects.humidityText.textContent = 'Fuktighet: ';

  objects.humidityTextValue.textContent = '';
  objects.humidityTextValue.textContent = `${humidity}%`;
}


buildWindSpeed = (windSpeed) => {
  // Bygger upp vindhastighet grid

  objects.windSpeedBlock.classList.remove('show');
  objects.windSpeedBlock.classList.add('hide');


  objects.windSpeedBlock.classList.remove('hide');
  objects.windSpeedBlock.classList.add('show');

  objects.windSpeedText.textContent = '';
  objects.windSpeedText.textContent = 'Vindhastighet: ';

  objects.windSpeedTextValue.textContent = '';
  objects.windSpeedTextValue.textContent = `${windSpeed} kmph`;
}


buildCityCompare = async (city) => {
  // Här jämför vi Malmö mot stad som vi plockade in innan och sparar om de som ett nytt object.
  // Vet inte om detta är bästa sätt men känns okay för mig.

  const url = `https://api.openweathermap.org/data/2.5/weather?q=malmö&lang=sv&appid=212514b52ee74f93d002ad15b350fc09`;
  let response = await fetch(url);
  let convertJson = await response.json();
  return {
    city: city.city_name,
    compare_degree_malmo: convertJson.main.temp - 273.15,
    compare_degree_city: city.degree,
  }
}


weatherClassAdd = (weatherDegree) => {
  // Väder check så ifall det är viss temperatur ute då byter vi färg på texten
  if (Math.round(weatherDegree) >= 20) {
    return objects.degreeBlock.classList.add('warm-weather');
  }
  else if (Math.round(weatherDegree) <= 10) {
    return objects.degreeBlock.classList.add('cold-weather');
  }
  else {
    return objects.degreeBlock.classList.add('decent-weather');
  }
}


setup();