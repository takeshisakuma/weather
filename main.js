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








                    //ステータス 200以外はエラー？
                    console.log(data.cod);

                    //メッセージ
                    console.log(data.message);

                    //取得する数
                    console.log(data.cnt);

                    //データ受信時刻
                    console.log(data.list[0].dt);

                    //気温
                    console.log(data.list[0].main.temp);

                    //体感気温
                    console.log(data.list[0].main.feels_like);

                    //最低気温
                    console.log(data.list[0].main.temp_min);

                    //最高気温
                    console.log(data.list[0].main.temp_max);

                    //気圧(hPa)
                    console.log(data.list[0].main.pressure);

                    //海面の気圧(hPa)
                    console.log(data.list[0].main.sea_level);

                    //地面の気圧(hPa)
                    console.log(data.list[0].main.grnd_level);

                    //湿度(%)
                    console.log(data.list[0].main.humidity);
                    console.log(data.list[0].main.temp_kf);

                    //天気id
                    console.log(data.list[0].weather[0].id);

                    //天気main
                    console.log(data.list[0].weather[0].main);

                    //天気詳細
                    console.log(data.list[0].weather[0].description);

                    //天気アイコン
                    console.log(data.list[0].weather[0].icon);

                    //雲の割合？（Cloudiness in %）
                    console.log(data.list[0].clouds.all);

                    //風速(meter/sec)
                    console.log(data.list[0].wind.speed);

                    //風向き
                    console.log(data.list[0].wind.deg);


                    console.log(data.list[0].sys.pod);

                    //日付と時刻
                    console.log(data.list[0].dt_txt);

                    console.log(data.list[8].dt_txt);

                    console.log(data.list[16].dt_txt);

                    console.log(data.list[24].dt_txt);

                    console.log(data.list[32].dt_txt);

                    console.log(data.list[39].dt_txt);



                    //都市ID
                    console.log(data.city.id);

                    //都市名
                    console.log(data.city.name);

                    //都市の緯度
                    console.log(data.city.coord.lat);

                    //都市の経度
                    console.log(data.city.coord.lon);

                    //都市の属する国(2文字)
                    console.log(data.city.country);

                    //都市の人口
                    console.log(data.city.population);

                    //都市のタイムゾーン　unixtime　時差(秒)32400
                    console.log(data.city.timezone);

                    //都市の日の出時刻　unixtime
                    console.log(data.city.sunrise);
                    console.log(data.city.sunrise + data.city.timezone);

                    //都市の日の入り時刻　unixtime
                    console.log(data.city.sunset);
                    console.log(data.city.sunset + data.city.timezone);











                    //気温
                    const tempAverageGroup = document.querySelectorAll(".js-tempAverage");
                    tempAverageGroup.forEach((value, index) => {
                        tempAverageGroup[index].innerText =
                            `気温
                        ${JSON.stringify(data.list[index].main.temp)}℃`;
                    });

                    //最高気温
                    const tempMaxGroup = document.querySelectorAll(".js-tempMax");
                    tempMaxGroup.forEach((value, index) => {
                        tempMaxGroup[index].innerText =
                            `最高気温
                        ${JSON.stringify(data.list[index].main.temp_max)}℃`;
                    });

                    //最低気温
                    const tempMinGroup = document.querySelectorAll(".js-tempMin");
                    tempMinGroup.forEach((value, index) => {
                        tempMinGroup[index].innerText =
                            `最低気温
                        ${JSON.stringify(data.list[index].main.temp_min)}℃`;
                    });

                    //アイコン
                    const weatherIconGroup = document.querySelectorAll(".js-icon");
                    weatherIconGroup.forEach((value, index) => {
                        const weatherIconPic = document.createElement("img");
                        weatherIconPic.src = `img/${JSON.stringify(data.list[8*index].weather[0].icon).replace(/\"/g, "")}.svg`;
                        weatherIconPic.alt = data.list[8 * index].weather[0].main;
                        console.log(weatherIconPic.alt);
                        weatherIconGroup[index].appendChild(weatherIconPic);
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
