if (navigator.geolocation) {
    // 現在位置を取得できる場合の処理
    console.log("あなたの端末では、現在位置を取得することができます。");
}

// Geolocation APIに対応していない
else {
    // 現在位置を取得できない場合の処理
    alert("あなたの端末では、現在位置を取得できません。");
}



const getPosition = () => {
    // 現在地を取得
    navigator.geolocation.getCurrentPosition(

        // 取得成功した場合
        (position) => {
            currentLat = position.coords.latitude;
            currentLon = position.coords.longitude;
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

let currentLat;
let currentLon;
getPosition();




const URL = " https://api.openweathermap.org/data/2.5/weather?id=1855503&appid=156cfe5a2b6fbbd3c831f6386d4282aa&units=metric";


const getWeather = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
}

/*
async function getWeather() {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
    // ↓無理やり一行で書くとこうなる
    // return await (await fetch(URL)).json();
}
*/
getWeather()
    .then(data => {

        //console.log
        console.log(JSON.stringify(data));

        //経度
        console.log(JSON.stringify(data.coord.lon));

        //緯度
        console.log(JSON.stringify(data.coord.lat));

        //天気id
        console.log(JSON.stringify(data.weather[0].id));

        //天気メイン
        console.log(JSON.stringify(data.weather[0].main));

        //天気解説
        console.log(JSON.stringify(data.weather[0].description));

        //天気アイコン
        console.log(JSON.stringify(data.weather[0].icon));

        //ベース
        console.log(JSON.stringify(data.base));

        //気温
        console.log(JSON.stringify(data.main.temp));


        //体感気温
        console.log(JSON.stringify(data.main.feels_like));

        //最低気温
        console.log(JSON.stringify(data.main.temp_min));

        //最高気温
        console.log(JSON.stringify(data.main.temp_max));

        //気圧(hPa)
        console.log(JSON.stringify(data.main.pressure));

        //湿度(%)
        console.log(JSON.stringify(data.main.humidity));

        //可視性
        console.log(JSON.stringify(data.visibility));

        //風速(meter/sec)
        console.log(JSON.stringify(data.wind.speed));

        //風向き
        console.log(JSON.stringify(data.wind.deg));

        //雲の割合？（Cloudiness in %）
        console.log(JSON.stringify(data.clouds.all));

        //データの時刻 GMTのunixtime形式(いわゆるEPOCH)
        console.log(JSON.stringify(data.dt));


        console.log(JSON.stringify(data.sys.type));
        console.log(JSON.stringify(data.sys.id));

        //国
        console.log(JSON.stringify(data.sys.country));

        //日の出時刻　unixtime
        console.log(JSON.stringify(data.sys.sunrise));

        //日の出時刻　日本


        //日の入り時刻 unixtime
        console.log(JSON.stringify(data.sys.sunset));

        //タイムゾーン　時差(秒)32400
        console.log(JSON.stringify(data.timezone));

        //地名のid？
        console.log(JSON.stringify(data.id));

        //地名
        console.log(JSON.stringify(data.name));

        //ステータス 200以外はエラー？
        console.log(JSON.stringify(data.cod));





        //画面に出力
        //document.body.innerHTML = JSON.stringify(data);



        //気温
        const tempAverage = document.querySelector("#js-tempAverage");
        tempAverage.innerText = "気温：" + JSON.stringify(data.main.temp);

        //最高気温
        const tempMax = document.querySelector("#js-tempMax");
        tempMax.innerText = "最高気温：" + JSON.stringify(data.main.temp_max);

        //最低気温
        const tempMin = document.querySelector("#js-tempMin");
        tempMin.innerText = "最低気温：" + JSON.stringify(data.main.temp_min);

        //アイコン
        const weatherIcon = document.querySelector("#js-icon");
        console.log(weatherIcon);
        const weatherIconPic = document.createElement("img");
        weatherIconPic.src = "http://openweathermap.org/img/wn/" + JSON.stringify(data.weather[0].icon).replace(/\"/g, "") + "@2x.png";
        console.log(weatherIconPic);
        weatherIcon.appendChild(weatherIconPic);


        //緯度
        const positionLat = document.querySelector("#js-positionLat");
        positionLat.innerText = "緯度：" + currentLat;

        //経度
        const positionLon = document.querySelector("#js-positionLon");
        positionLon.innerText = "経度：" + currentLon;




        //地図
        const embedMap = document.querySelector("#js-embedMap");
        embedMap.src = `https://maps.google.co.jp/maps?output=embed&q=${currentLat},${currentLon}`;




    })

    .catch(err => {
        console.log(err);

    })
