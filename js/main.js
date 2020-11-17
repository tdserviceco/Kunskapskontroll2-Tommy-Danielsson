const values = {
  loading: document.querySelector('.loading'),
  result: document.querySelector('.result'),
  error: document.querySelector('.error'),
  cityCompareBlock: document.querySelector('.city-compare'),
  descriptionBlock: document.querySelector('.description'),
  humidityBlock: document.querySelector('.humidity'),
  degreeBlock: document.querySelector('.degree'),
  windSpeedBlock: document.querySelector('.wind-speed'),
}

setup = () => {
  // Lite upplägg av variabel som ger klass till de som behöver just när sidan startar.. i detta fall class namn: hide
  const { loading, result, error, cityCompareBlock } = values;
  loading.classList.add('hide');
  result.classList.add('hide');
  error.classList.add('hide');
  cityCompareBlock.classList.add('hide');
  fetchCityValue();
}

fetchCityValue = (city) => {
  /* Vi kommer alltid få undefiend första gången 
  (pågrund av jag föraktiverar funktion utan nåt att ge den..) 
  så därför säger jag till den gå till FormField och kolla där om det finns nåt.
  Får vi nåt värde tillbaka så kör vi fetchCityWeather funktionen (som är en async/await)
  */
  if (city === undefined) {
    return formField();
  }
  else {
    const { loading, result, error, cityCompareBlock } = values;

    return fetchCityWeather(city).then(res => {
      if (res.code === '404') {
        error.classList.remove('hide');
        error.classList.add('show')
        return error.children[0].textContent = res.message;
      }
      else {
        error.classList.remove('show')
        error.classList.add('hide')
        loading.classList.add('show');
        loading.ontransitionend = () => {
          loading.classList.remove('show');
          loading.classList.add('hide');
          result.classList.add('show');
        }
        result.classList.remove('show');
        result.ontransitionend = () => {
          result.classList.add('show');
        }

        buildDescription(res.description, res.icon);
        buildHumidity(res.humidity)
        buildDegree(res.degree);
        buildWindSpeed(res.windSpeed);
        buildCityCompare(res).then(compare => {

          // Har ingen catch i denna för vi kommer alltid få rätt stad (malmö)
          // Däremot använder jag Math.abs() för omvandla - till + för vi måste säga att det är + skillnad.
          cityCompareBlock.classList.remove('hide');
          cityCompareBlock.classList.add('show');


          let city = compare.compare_degree_city;
          let malmo = compare.compare_degree_malmo;

          const differenceBetweenCity = Math.abs(Math.round(malmo) - Math.round(city));
          if (compare.city === 'Malmo') {
            return cityCompareBlock.children[0].textContent = 'Jämför du samma stad?'
          }
          return cityCompareBlock.children[0].textContent = `Skilland mellan Malmö och ${compare.city} är: ${differenceBetweenCity} i grader`
        })
      }

    }).catch(issues => {
      console.error(issues);
    });
  }
}

fetchCityWeather = async (city) => {
  // Api nyckel skrivs in här
  const apiKey = '212514b52ee74f93d002ad15b350fc09';
  // Hämtar data från openweathermap.org api och ifall det är ingen stad vid namn av X då returnerar vi en error tillbaka.
  // Annars sparar vi ner saker vi vill ha och retunerar tillbaka.
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=se&units=metric&appid=${apiKey}`;
  let response = await fetch(url);
  let convertJson = await response.json();
  if (convertJson.cod === '404') {
    return {
      code: convertJson.cod,
      message: convertJson.message
    };
  }
  return {
    description: convertJson.weather[0].description,
    icon: `http://openweathermap.org/img/wn/${convertJson.weather[0].icon}.png`,
    windSpeed: convertJson.wind.speed,
    degree: convertJson.main.temp,
    humidity: convertJson.main.humidity,
    city_name: convertJson.name
  }
}

formField = () => {
  //Hämta input från formulär av classnamn .weather-form
  const form = document.querySelector('.weather-form');
  form.addEventListener('submit', formSubmited)
  return form;
}


formSubmited = (e) => {
  // från form.addEventListener('submit', formSubmited) hämtar vi värdet och returnerar det tillbaka till FetchCityValue.
  e.preventDefault();
  let city = e.target.city.value;
  return fetchCityValue(city);
}

//Här börjar vi bygga varje sektion hur allt ska vara

buildDescription = (description, icon) => {
  const { descriptionBlock } = values;
  // Struktur hur vi vill text och värde ska uppföra sig

  descriptionBlock.children[0].textContent = 'Väder:';
  descriptionBlock.children[1].children[0].textContent = description;
  descriptionBlock.children[1].children[1].setAttribute('src', icon);
  return descriptionBlock;
}


buildHumidity = (humidity) => {
  // Struktur hur vi vill text och värde ska uppföra sig
  const { humidityBlock } = values;
  humidityBlock.children[0].textContent = 'Fuktighet:';
  humidityBlock.children[1].textContent = `${humidity}%`;
  return humidityBlock;
}


buildDegree = (degree) => {
  // Struktur hur vi vill text och värde ska uppföra sig
  const { degreeBlock } = values;
  weatherClassAdd(degree, degreeBlock);
  degree = `${degree}°c`;
  degreeBlock.children[0].textContent = 'Temperatur:';
  degreeBlock.children[1].textContent = degree
  return degreeBlock;
}

buildWindSpeed = (windSpeed) => {
  // Struktur hur vi vill text och värde ska uppföra sig
  const { windSpeedBlock } = values;
  windSpeedBlock.children[0].textContent = 'Vindhastighet:'
  windSpeedBlock.children[1].textContent = `${windSpeed} kmph`;
  return windSpeedBlock;
}

weatherClassAdd = (weatherDegree, degreeBlock) => {
  // Väder check så ifall det är viss temperatur ute då byter vi färg på texten
  if (weatherDegree >= 20) {
    return degreeBlock.children[1].classList.add('warm-weather');
  }
  else if (weatherDegree <= 10) {
    return degreeBlock.children[1].classList.add('cold-weather');
  }
  else {
    return degreeBlock.children[1].classList.add('decent-weather');
  }
}

buildCityCompare = async (city) => {
  // Här jämför vi Malmö mot stad som vi plockade in innan och sparar om de som ett nytt object.
  // Vet inte om detta är bästa sätt men känns okay för mig.

  const url = `https://api.openweathermap.org/data/2.5/weather?q=malmö&lang=sv&units=metric&appid=212514b52ee74f93d002ad15b350fc09`;
  let response = await fetch(url);
  let convertJson = await response.json();

  return {
    city: city.city_name,
    compare_degree_malmo: convertJson.main.temp,
    compare_degree_city: city.degree,
  }
}

setup()