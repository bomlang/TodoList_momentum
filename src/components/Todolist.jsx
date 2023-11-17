import axios from "axios";
import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Todolist({ hover, title, id, updateList }) {
  const [checked, setChecked] = useState(false);

  const handleTodoCheck = async () => {
    try {
      const updatedData = {
        title: "JS 프로젝트 완성",
        content: "화요일까지 완료해야 함.",
        done: !checked,
      };

      await axios.patch(
        `http://localhost:33088/api/todolist/${id}`,
        updatedData
      );

      setChecked((prevChecked) => !prevChecked);
    } catch (error) {
      console.error(error);
    }
  };

  // X버튼 클릭시 항목을 제거하는 함수
  const handleDeleteItem = () => {
    // setElipsisClick((prevClick) => !prevClick);
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
        onClick={handleTodoCheck}
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
