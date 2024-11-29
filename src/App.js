import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import humidity from '../src/img/humidity.svg';
import sun from '../src/img/sun.svg';
import rain from '../src/img/rain.svg';
import sun_big_cloud from '../src/img/sun-big-cloud.svg';
import sun_small_cloud from '../src/img/sun-small-cloud.svg';
import cloud from '../src/img/cloud.svg';
import Loading from './components/loading';
import History from './components/history';

export default function ViewWeather() {
  const [dataSearch, setDataSearch] = useState([]);
  const [hourSearch, setHourSearch] = useState([]);

  const [data, setData] = useState([]);
  const [icon, setIcon] = useState();
  const [historic, setHistoric] = useState([]);

  const handleClick = async () => {
    const response = await axios.get(
      `http://localhost:3004/buscar?date=${dataSearch}&hour=${hourSearch}`
    );
    setHistoric(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3004/listWeather');
      const weatherData = Object.values(response.data);
      const weatherSorted = weatherData.reverse();
      const humidity = parseInt(weatherSorted[0].humidity);
      const temperature = parseInt(weatherSorted[0].temperature);
      setData(weatherSorted[0]);

      if (temperature > 27 && humidity === 0) {
        setIcon(sun);
      } else if (temperature > 27 && humidity <= 40) {
        setIcon(sun_small_cloud);
      } else if (temperature > 27 && humidity >= 40 && humidity <= 70) {
        setIcon(sun_big_cloud);
      } else if (humidity > 70) {
        setIcon(rain);
      } else {
        setIcon(cloud);
        console.log('umidade: ', humidity, ' temperatura: ', temperature);
      }
    };

    const connectionWs = () => {
      const ws = new WebSocket('ws://localhost:3004');
      ws.onmessage = (event) => {
        try {
          const { event: eventType } = JSON.parse(event.data);
          if (eventType === 'update') {
            fetchData();
          }
        } catch (err) {
          console.error('Erro ao processar mensagem real time:', err);
        }
      };
      return () => {
        ws.close();
      };
    };

    fetchData();
    connectionWs();
  }, []);

  return (
    <div className="container">
      <History />
      {data ? (
        <>
          <div className="card_main">
            <img
              className="img_"
              src={icon}
              alt="Imagem referente a temperatura"
            />
            <section className="info_date_hour">
              <p>
                {data.date} | {data.hour}
              </p>
            </section>
            <section className="info_card">
              <section className="info_humidity">
                <img className="icon_humidity" src={humidity} />
                <h2>{data.humidity}%</h2>
              </section>
              <h2 className="info_temperature">{data.temperature}°C</h2>
            </section>
          </div>
        </>
      ) : (
        <div>
          <Loading />
        </div>
      )}
      <section className="section-search">
        <label>Pesquise por data</label>
        <input
          placeholder="Data"
          onChange={(e) => setDataSearch(e.target.value)}
          value={dataSearch}
        />
        <label>Pesquise por hora</label>
        <input
          placeholder="Hora"
          onChange={(e) => setHourSearch(e.target.value)}
          value={hourSearch}
        />
        <button onClick={handleClick}>Procurar</button>

        {historic &&
          historic.map((hist) => (
            <div className="historic-item" key={hist.id}>
              <p>Temperatura:</p>
              <p>{hist.temperature}</p>
              <p>Humidade:</p>
              <p>{hist.humidity}</p>
            </div>
          ))}
      </section>
    </div>
  );
}
