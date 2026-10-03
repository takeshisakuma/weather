const myAppID = "156cfe5a2b6fbbd3c831f6386d4282aa";
const myUnits = "metric";
const myLang = "ja";
const apiBase = "https://api.openweathermap.org/data/2.5";

//2枚目以降のカードに表示する予報(何時間後か)
const forecastHours = [24, 48];

//前回の取得結果の保存先
const storageKey = "weather-lastResult";

const loaderLayer = document.getElementById("js-loadingLayer");
const currentPosition = document.getElementById("js-currentPosition");
const embedMap = document.getElementById("js-embedMap");


const hideLoading = () => {
  loaderLayer.classList.remove("active");
};

//画面内にメッセージを表示
const showMessage = (message) => {
  currentPosition.innerText = message;
  hideLoading();
};


const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};

//指定時間後に最も近い予報を取得
const pickForecast = (list, hours) => {
  const target = Date.now() / 1000 + hours * 60 * 60;
  return list.reduce((nearest, item) =>
    Math.abs(item.dt - target) < Math.abs(nearest.dt - target) ? item : nearest
  );
};

const renderCard = (card, data) => {
  const weather = data.weather[0];

  //気温
  card.querySelector(".js-temp").innerText = Math.round(data.main.temp);

  //湿度
  card.querySelector(".js-humidity").innerText = data.main.humidity;

  //気圧
  card.querySelector(".js-pressure").innerText = data.main.pressure;

  //アイコン
  const iconImg = card.querySelector(".js-icon img");
  iconImg.src = `img/${weather.icon}.svg`;
  iconImg.alt = weather.description;

  //説明
  card.querySelector(".js-description").innerText = weather.description;
};

const renderCards = (dataGroup) => {
  document.querySelectorAll(".js-dayCard").forEach((card, index) => {
    renderCard(card, dataGroup[index]);
  });
};


//取得結果を保存(オフライン時の表示用)
const saveResult = (result) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(result));
  } catch (err) {
    console.log(err);
  }
};

const loadResult = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch (err) {
    return null;
  }
};

//前回の取得結果があれば表示、なければメッセージのみ表示
const showLastResult = (message) => {
  const result = loadResult();

  if (!result) {
    showMessage(message);
    return;
  }

  const savedTime = new Date(result.time).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  renderCards(result.dataGroup);
  showMessage(`${message}\n前回(${savedTime})に取得した${result.name}の天気を表示しています。`);
};


const getWeather = async (lat, lon) => {
  const query = `lat=${lat}&lon=${lon}&appid=${myAppID}&units=${myUnits}&lang=${myLang}`;

  const [current, forecast] = await Promise.all([
    fetchJSON(`${apiBase}/weather?${query}`),
    fetchJSON(`${apiBase}/forecast?${query}`)
  ]);

  const dataGroup = [
    current,
    ...forecastHours.map(hours => pickForecast(forecast.list, hours))
  ];

  renderCards(dataGroup);

  //現在地
  currentPosition.innerText = "現在地：" + current.name;

  //地図
  embedMap.src = `https://maps.google.co.jp/maps?output=embed&q=${lat},${lon}`;
  embedMap.hidden = false;

  saveResult({
    dataGroup,
    name: current.name,
    time: Date.now()
  });
};


const getPosition = () => {
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(

    // 取得成功した場合
    (position) => {
      getWeather(position.coords.latitude, position.coords.longitude)
        .then(hideLoading)
        .catch(err => {
          console.log(err);
          showLastResult("天気情報を取得できませんでした。");
        });
    },

    // 取得失敗した場合
    (error) => {
      switch (error.code) {
        case 1: //PERMISSION_DENIED
          showMessage("位置情報の利用が許可されていません。");
          break;
        case 2: //POSITION_UNAVAILABLE
          showLastResult("現在位置が取得できませんでした。");
          break;
        case 3: //TIMEOUT
          showLastResult("現在位置の取得がタイムアウトになりました。");
          break;
        default:
          showMessage("その他のエラー(エラーコード:" + error.code + ")");
          break;
      }
    },

    {
      timeout: 10000
    });
};


//Service Workerを登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(err => {
    console.log(err);
  });
}


//Geolocation api使用可能の場合
if (navigator.geolocation) {
  getPosition();
}

//Geolocation API使用不可能の場合
else {
  showMessage("この端末は現在位置を取得できません。");
}
