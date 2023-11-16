import axios from "axios";
import Todolist from "./Todolist";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowUp } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [imageData, setImageData] = useState(null);
  const [openWeatherKey] = useState(import.meta.env.VITE_OPENWEATHER_KEY);
  const [weatherData, setWeatherData] = useState(null);
  const [clock, setClock] = useState("Clock not working");
  const [hover, setHover] = useState(false);
  const [todoData, setTodoData] = useState([]);
  const [todoUploadBtn, setTodoUploadBtn] = useState(false);
  const [todoWrite, setTodoWrite] = useState("");

  useEffect(() => {
    const city = "Seoul";

    const fetchData = async () => {
      try {
        const imageDataResponse = await axios.get(
          "https://picsum.photos/1800/1000/?grayscale&blur=4"
        );
        setImageData(imageDataResponse.config.url);

        const weatherDataResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}`
        );
        setWeatherData(weatherDataResponse);

        const todoDataResponse = await axios.get(
          "http://localhost:33088/api/todolist/"
        );
        setTodoData(todoDataResponse.data.items);
      } catch (error) {
        console.error(error);
      }
    };

    const Timer = setInterval(() => {
      let time = new Date();
      const hours = time.getHours();
      const minutes = time.getMinutes();

      setClock(
        `${hours < 10 ? `0${hours}` : hours} : ${
          minutes < 10 ? `0${minutes}` : minutes
        }`
      );
    }, 1000);

    fetchData();

    return () => {
      clearInterval(Timer);
    };
  }, []);

  // todo 추가시 업데이트하여 리렌더링되도록 하는 함수
  const updateTodoList = async () => {
    try {
      const response = await axios.get("http://localhost:33088/api/todolist/");
      setTodoData(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTodoUploadBtn = () => {
    setTodoUploadBtn((prevBtn) => !prevBtn);
  };

  const handleTodoWrite = (event) => {
    const value = event.target.value;
    setTodoWrite(value);
  };

  const handleTodoUpload = async () => {
    const todo = {
      title: todoWrite,
      content: "화요일까지 완료해야 함.",
      done: false,
    };
    try {
      await axios
        .post("http://localhost:33088/api/todolist/", todo)
        .then((res) => {
          updateTodoList();
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {weatherData && imageData ? (
        <article
          className="w-screen h-screen bg-cover z-0 flex justify-center items-center relative"
          style={{ backgroundImage: `url(${imageData})` }}
        >
          <section className="font-semibold text-white">
            <div className="text-white flex flex-col justify-center items-center font-bold">
              <div className="text-white text-9xl">{clock}</div>
              <span className="text-4xl">Good Working, HORI</span>
            </div>
            <div
              className="text-white flex flex-col items-center mt-[5em] w-[30em] h-[6em]"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <h3 className="text-2xl">TODAY</h3>
              <ul>
                {todoData ? (
                  todoData.map((item) => (
                    <Todolist
                      key={item._id}
                      hover={hover}
                      title={item.title}
                      id={item._id}
                    />
                  ))
                ) : (
                  <div>Failed to load data information.😩</div>
                )}
              </ul>
            </div>
          </section>

          <section className="absolute bottom-[0.5em] right-[0.8em] text-white font-bold text-2xl">
            <div className="relative">
              <div
                className={`${
                  todoUploadBtn ? "block" : "hidden"
                } absolute bottom-[1.5em] right-[0.5em] w-[16em] h-[5em] border-[1px] border-white rounded-[1.6em] flex justify-center items-center gap-5`}
                style={{ backdropFilter: "blur(30px)" }}
              >
                <input
                  type="text"
                  className="bg-inherit border-b-2 border-white focus:outline-none"
                  onChange={handleTodoWrite}
                />
                <button onClick={handleTodoUpload}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
              </div>
              <button onClick={handleTodoUploadBtn}>TODO UPDATE</button>
            </div>
          </section>

          <section className="text-white text-2xl absolute top-[0.5em] right-[0.8em]">
            {weatherData.data.weather[0].description}
          </section>

          <section className="text-white absolute bottom-[0.5em] left-[0.8em] flex items-center text-2xl">
            <FontAwesomeIcon icon={faGear} />
            <div className=" ml-[0.5em]">option</div>
          </section>
        </article>
      ) : (
        <div className="text-xl text-orange-400">Loading...</div>
      )}
    </>
  );
}

export default App;
