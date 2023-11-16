import axios from "axios";
import { useState } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Todolist({ hover, title, id }) {
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

  return (
    <li className="flex items-center m-auto justify-center">
      <input
        type="checkbox"
        className={`w-[1.4em] h-[1.4em] ${hover ? "block" : "hidden"}`}
        onClick={handleTodoCheck}
      />
      <div className="text-[2.2em] mx-[1rem]">{title}</div>
      <FontAwesomeIcon
        icon={faEllipsis}
        className={`text-2xl ${hover ? "block" : "hidden"}`}
      />
    </li>
  );
}

export default Todolist;
