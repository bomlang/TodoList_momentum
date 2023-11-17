import axios from "axios";
import { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Todolist({ hover, title, id, updateList }) {
  // 로컬 스토리지에서 체크박스 상태를 가져오기
  const storedChecked = JSON.parse(localStorage.getItem(`todo-${id}`)) || false;
  const [checked, setChecked] = useState(storedChecked);

  // useEffect를 사용하여 컴포넌트가 마운트될 때만 실행되도록 설정
  useEffect(() => {
    // 체크박스 상태를 로컬 스토리지에 저장
    localStorage.setItem(`todo-${id}`, JSON.stringify(checked));
  }, [checked, id]);

  const handleTodoCheck = async () => {
    try {
      const updatedData = {
        done: !checked,
      };

      await axios
        .patch(`http://localhost:33088/api/todolist/${id}`, updatedData)
        .then(() => {
          setChecked((prevChecked) => !prevChecked);
        });
    } catch (error) {
      console.error(error);
    }
  };

  // X버튼 클릭시 항목을 제거하는 함수
  const handleDeleteItem = () => {
    try {
      axios.delete(`http://localhost:33088/api/todolist/${id}`).then(() => {
        updateList();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className="flex items-center m-auto justify-center relative">
      <input
        type="checkbox"
        className={`w-[1.4em] h-[1.4em] ${hover ? "block" : "hidden"}`}
        checked={checked}
        onChange={handleTodoCheck}
      />
      <div className="text-[2.2em] mx-[1rem]">{title}</div>
      <button>
        <FontAwesomeIcon
          icon={faXmark}
          className={`text-2xl ${hover ? "block" : "hidden"} cursor-pointer`}
          onClick={handleDeleteItem}
        />
      </button>
    </li>
  );
}

export default Todolist;
