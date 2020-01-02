const loaderLayer = document.getElementById("js-loadingLayer");
const loadedTransiton = () => {
  loaderLayer.classList.remove("active");
}
window.addEventListener("load", loadedTransiton);




//Geolocation api使用可能の場合
if (navigator.geolocation) {
  console.log("この端末は現在位置を取得することができます");
}

//Geolocation API使用不可能の場合
else {
  alert(`この端末は現在位置を取得できません。
    位置情報を使用するには、

    iOSは「一般」→「プライバシー」→「位置情報サービス」で位置情報サービスをオンにしてください。

    Androidは「設定」→「位置情報」で位置情報をオンにしてください。`);
}





const myAppID = "156cfe5a2b6fbbd3c831f6386d4282aa";
const myUnits = "metric";
const myLang = "ja";
let currentLat;
let currentLon;






const getPosition = () => {
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(

    // 取得成功した場合
    (position) => {
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;


      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLat}&lon=${currentLon}&appid=${myAppID}&units=${myUnits}&lang=${myLang}`;





      //getWeather作成
      const getWeather = async () => {

        const res = await fetch(forecastURL);
        const data = await res.json();
        return data;

      }

      //getWeather実行
      getWeather()
        .then(data => {

          //気温
          const tempGroup = document.querySelectorAll(".js-temp");
          tempGroup.forEach((value, index) => {
            tempGroup[index].innerText =
              JSON.stringify(data.list[8 * index].main.temp)
          });


          //気圧
          const pressureGroup = document.querySelectorAll(".js-pressure");
          pressureGroup.forEach((value, index) => {
            pressureGroup[index].innerText =
              JSON.stringify(data.list[8 * index].main.pressure);
          });

          //湿度
          const humidityGroup = document.querySelectorAll(".js-humidity");
          humidityGroup.forEach((value, index) => {
            humidityGroup[index].innerText =
              JSON.stringify(data.list[8 * index].main.humidity)
          });


          //アイコン
          const weatherIconGroup = document.querySelectorAll(".js-icon");
          weatherIconGroup.forEach((value, index) => {
            const iconImg = weatherIconGroup[index].firstElementChild;
            iconImg.src = `img/${JSON.stringify(data.list[8*index].weather[0].icon).replace(/\"/g, "")}.svg`;
            iconImg.alt = data.list[8 * index].weather[0].main;
          });



          //説明
          const descriptionGroup = document.querySelectorAll(".js-description");
          descriptionGroup.forEach((value, index) => {
            descriptionGroup[index].innerText = JSON.stringify(data.list[8 * index].weather[0].description);
          })


          //現在地
          const currentPosition = document.querySelector("#js-currentPosition");
          currentPosition.innerText = "現在地：" + data.city.name;



          //地図
          const embedMap = document.querySelector("#js-embedMap");
          embedMap.src = `https://maps.google.co.jp/maps?output=embed&q=${currentLat},${currentLon}`;




        })

        .catch(err => {
          console.log(err);

        })
    },

    // 取得失敗した場合
    (error) => {
      switch (error.code) {
        case 1: //PERMISSION_DENIED
          alert("位置情報の利用が許可されていません");
          break;
        case 2: //POSITION_UNAVAILABLE
          alert("現在位置が取得できませんでした");
          break;
        case 3: //TIMEOUT
          alert("タイムアウトになりました");
          break;
        default:
          alert("その他のエラー(エラーコード:" + error.code + ")");
          break;
      }
    });
};


getPosition();
