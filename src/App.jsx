import axios from "axios";
import Todolist from "./components/Todolist";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faArrowUp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { clockState, imageDataState, openWeatherData } from "./atoms";

function App() {
  const [openWeatherKey] = useState(import.meta.env.VITE_OPENWEATHER_KEY);
  const [hover, setHover] = useState(false);
  const [todoData, setTodoData] = useState([]);
  const [todoUploadBtn, setTodoUploadBtn] = useState(false);
  const [optionBtn, setOptionBtn] = useState(false);
  const [todoWrite, setTodoWrite] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);

  // 완료된 아이템의 리스트
  const [completedTodoData, setCompletedTodoData] = useState([]);

  const [clock, setClock] = useRecoilState(clockState);
  const [imageData, setImageData] = useRecoilState(imageDataState);
  const [weatherData, setWeatherData] = useRecoilState(openWeatherData);

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
        .then(() => {
          updateTodoList();
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchbarClick = () => {
    setSearchIcon((prevSearchIcon) => !prevSearchIcon);
  };

  const handleOptionBtnClick = () => {
    setOptionBtn((prevOptionBtn) => !prevOptionBtn);
  };

  const handleCompletedList = () => {
    const completedItems = todoData.filter((item) => item.done === true);
    setCompletedTodoData(completedItems);
  };

  return (
    <>
      {weatherData && imageData ? (
        <article
          className="w-screen h-screen bg-cover z-0 flex justify-center items-center relative"
          style={{ backgroundImage: `url(${imageData})` }}
        >
          <section className="font-semibold text-white">
            <div className="h-[10em]"></div>
            <div className="text-white flex flex-col justify-center items-center font-bold">
              <div className="text-white text-9xl">{clock}</div>
              <span className="text-4xl">Good Working, HORI</span>
            </div>

            <div
              className="text-white flex flex-col items-center mt-[5em]"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <h3 className="text-3xl mb-[1em]">Today Todo-List</h3>
              {completedTodoData.length > 0 ? (
                <ul className="w-[30em] h-[17em] overflow-auto mb-[3em]">
                  {completedTodoData.map((item) => (
                    <Todolist
                      key={item._id}
                      hover={hover}
                      title={item.title}
                      id={item._id}
                      updateList={updateTodoList}
                    />
                  ))}
                </ul>
              ) : (
                <ul className="w-[30em] h-[17em] overflow-auto mb-[3em]">
                  {todoData.map((item) => (
                    <Todolist
                      key={item._id}
                      hover={hover}
                      title={item.title}
                      id={item._id}
                      updateList={updateTodoList}
                    />
                  ))}
                </ul>
              )}
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

          <section className="text-white text-2xl absolute top-[0.5em] right-[0.8em] flex items-center">
            <img
              src={`http://openweathermap.org/img/w/${weatherData.data.weather[0].icon}.png`}
              alt=""
            />
            <span className="pb-2">
              {weatherData.data.weather[0].description}
            </span>
          </section>

          <section className="text-white absolute bottom-[0.5em] left-[0.8em] text-2xl font-bold">
            <button
              className=" ml-[0.5em] flex items-center gap-2"
              onClick={handleOptionBtnClick}
            >
              <FontAwesomeIcon icon={faGear} />
              <p>option</p>
            </button>
            <ul
              className={`${
                optionBtn ? "block" : "hidden"
              } absolute bottom-[1.5em] left-[0.5em] w-[5em] h-[7em] border-2 border-white rounded-[1em] flex flex-col justify-center items-center gap-2`}
              style={{ backdropFilter: "blur(30px)" }}
            >
              <li className="text-[18px] border-b-2 borer-white">
                {/* All Todo list부분과 Completed부분 버튼이 잘 작동하지 않음. */}
                <button onClick={updateTodoList}>All Todo list</button>
              </li>
              <li className="text-[18px] border-b-2 borer-white">
                <button onClick={handleCompletedList}>Completed</button>
              </li>
              <li className="text-[18px] border-b-2 borer-white">
                <button>Quick date</button>
              </li>
              <li className="text-[18px]">
                <button>Late date</button>
              </li>
            </ul>
          </section>

          <section
            className={`flex items-center absolute top-[0.5em] left-[0.8em] ${
              searchIcon ? "border-b-2" : "border-none"
            }  border-white pb-1`}
          >
            <div
              className="cursor-pointer h-[3em] flex items-center"
              onClick={handleSearchbarClick}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-white font-bold text-2xl mr-1"
              />
            </div>
            {searchIcon && (
              <form
                className={`gap-3 flex w-[17.5em] items-center p-1 justify-between `}
              >
                <input
                  type="text"
                  className="w-[15em] bg-inherit focus:outline-none"
                  placeholder="Search Todo List..."
                />
                <button
                  type="button"
                  className="border border-white text-white font-bold p-1 rounded-md"
                >
                  Search
                </button>
              </form>
            )}
          </section>
        </article>
      ) : (
        <div className="text-xl text-orange-400">Loading...</div>
      )}
    </>
  );
}

export default App;
