# weather

OpenWeatherMap の API を利用した天気予報アプリです。
現在地の「現在の天気」「24時間後の天気」「48時間後の天気」と、現在地の地図を表示します。

https://takeshisakuma.github.io/weather/

## 使い方

ブラウザで開き、位置情報の利用を許可してください。

ホーム画面に追加してアプリのように使えます。オフラインのときは、前回取得した天気を表示します。

## ローカルで動かす

ビルドは不要です。位置情報 API は `https` か `localhost` でしか動かないため、Live Server などのローカルサーバーで `index.html` を開いてください。

## 使用しているもの

- [OpenWeatherMap API](https://openweathermap.org/api)（Current Weather / 5 day forecast）
- Geolocation API
- Google マップの埋め込み
