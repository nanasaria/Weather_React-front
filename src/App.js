import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import humidity from '../src/img/humidity.svg'
import sun from '../src/img/sun.svg'
import rain from '../src/img/rain.svg'
import sun_big_cloud from '../src/img/sun-big-cloud.svg'
import sun_small_cloud from '../src/img/sun-small-cloud.svg'
import cloud from '../src/img/cloud.svg'
import Loading from './components/loading';

export default function ViewWeather() {
  const [data, setData] = useState([]);
  const [icon, setIcon] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3004/listWeather');
      const weatherData = Object.values(response.data);
      const weatherSorted = weatherData.reverse()
      const humidity = parseInt(weatherSorted[0].humidity)
      const temperature = parseInt(weatherSorted[0].temperature)
      setData(weatherSorted[0])

      if(temperature > 27 && humidity === 0){
        setIcon(sun)
      }else if(temperature > 27 && humidity <= 40){
        setIcon(sun_small_cloud)
      }else if(temperature > 27 && humidity >= 40 && humidity <= 70){
        setIcon(sun_big_cloud)
      }else if(humidity > 70){
        setIcon(rain)
      }else{
        setIcon(cloud)
        console.log('umidade: ', humidity, ' temperatura: ', temperature)
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='container'>
      {data ? (
        <div className='card_main'>
          <img className='img_' src={icon} alt='Imagem referente a temperatura'/>
          <section className='info_card'>
              <section className='info_humidity'>
                <img className='icon_humidity' src={humidity} />
                <h2>{data.humidity}%</h2>
              </section>
            <h2 className='info_temperature'>{data.temperature}°C</h2>
          </section>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
}
