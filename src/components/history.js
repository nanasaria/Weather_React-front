import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../components/styles/history.css'
import cloud from '../img/cloudHistory.png'
import humidity from '../img/humidity.svg'

const History = () => {
    const [burguer_class, setBurguerClass] = useState("burguer-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu hidden")
    const [isMenuClicked, setIsMenuClicked] = useState(false)  
    const [data, setData] = useState([]);

    const updateMenu = () => {
        if(!isMenuClicked) {
            setBurguerClass('burguer-bar clicked')
            setMenuClass('menu visible')
        }
        else{
            setBurguerClass('burguer-bar unclicked')
            setMenuClass('menu hidden')
        }
        setIsMenuClicked(!isMenuClicked)
    }

    useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get('http://localhost:3004/listWeather');
        const weatherData = Object.values(response.data);
        const weatherSorted = weatherData.reverse().slice(0, 6);
        setData(weatherSorted);
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
    }

    fetchData();
    connectionWs();
  }, []);

  return (
    <div style={{width: '100%', height: '100vh'}}>
        <nav>
            <div className='burguer_menu' onClick={updateMenu}>
                <div className={burguer_class}></div>
                <div className={burguer_class}></div>
                <div className={burguer_class}></div>
            </div>

            <p className='title_history'>Histórico</p>
        </nav>

        <div className={menu_class}>
        {data.map((weather, index) => (
            <section className='history_info_cards'>
                <img className='img_cloud' src={cloud}></img>
                <section className='date_hour_history'>
                    <p className='date_history' key={index}>{weather.date}</p>
                    <p className='hour_history' key={index}>{weather.hour}</p>
                </section>
                <section className='humidity_temperature_history'>
                    <p className='temperature_history' key={index}>{weather.temperature}°C</p>
                    <div className='humidity_history'>
                        <img className='icon_humidity_history' src={humidity} />
                        <p className='humidity_history' key={index}>{weather.humidity}</p>
                    </div>
                </section>
            </section>  
        ))}   
        </div>
    </div>
  )
}

export default History
