import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function searchBar() {
  return (
    <div>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <form action="">
        <input type="search" />
        <button type="button"></button>
      </form>
    </div>
  );
}

export default searchBar;
