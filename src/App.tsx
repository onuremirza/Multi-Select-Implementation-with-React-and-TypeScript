import "./App.css";
import { RiArrowDropDownFill } from "react-icons/ri";
import axios from "axios";
import { useEffect, useState } from "react";
import Social from "./components/Social";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [cursor, setCursor] = useState(0);
  const [checkboxStates, setCheckboxStates] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [dropList, setDropList] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrop = () => {
    if (dropList === "hidden") {
      setDropList("");
    } else {
      setDropList("hidden");
    }
  };

  const handleNavigate = (key: any) => {
    setCursor(key);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowDown") {
        setCursor((prevCursor) =>
          prevCursor < data.length - 1 ? prevCursor + 1 : prevCursor
        );
      } else if (event.key === "ArrowUp") {
        setCursor((prevCursor) =>
          prevCursor > 0 ? prevCursor - 1 : prevCursor
        );
      } else if (event.key === "Enter") {
        handleCheckbox(cursor);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursor, data, checkboxStates]);

  const handleCheckbox = (item: any) => {
    const character = data[item];
    if (checkboxStates.some((item: any) => item.id === character.id)) {
      // If character exists in checkboxStates, delete it
      setCheckboxStates((prevCheckboxStates) =>
        prevCheckboxStates.filter((item: any) => item.id !== character.id)
      );
    } else {
      // If character does not exist in checkboxStates, add it
      setCheckboxStates((prevCheckboxStates) => [
        ...prevCheckboxStates,
        character,
      ]);
    }
  };

  const handleCheckboxWithId = (id: any) => {
    if (checkboxStates.some((item: any) => item.id === id)) {
      // If character exists in checkboxStates, delete it
      setCheckboxStates((prevCheckboxStates) =>
        prevCheckboxStates.filter((item: any) => item.id !== id)
      );
    }
  };

  const getAPI = async (event: any) => {
    setSearchText(event.target.value);
    setLoading(true);
    if (!event.target.value) {
      setData([]);
    } else {
      axios
        .get(
          `https://rickandmortyapi.com/api/character/?name=${event.target.value}`
        )
        .then((value: any) => {
          setLoading(false);
          setData(value.data.results);
        })
        .catch((error: any) => {
          setLoading(false);
          setData([]);
        });
    }
  };

  const highlightMatches = (name: string) => {
    const regex = new RegExp(searchText, "gi");
    return name.replace(
      regex,
      (match) => `<span class="font-bold">${match}</span>`
    );
  };

  return (
    <div className="flex flex-col m-4 gap-4 h-screen">
      <div className="flex w-full p-2 border-[1px] rounded-xl border-black overflow-auto">
        <div className="gap-2 flex items-center">
          {checkboxStates.map((value: any, key: any) => (
            <div className="flex gap-2 rounded-xl bg-gray-300 p-2 items-center text-nowrap ">
              {value.name}
              <div
                onClick={() => handleCheckboxWithId(value.id)}
                className="text-white bg-gray-400 rounded-md p-1"
              >
                X
              </div>
            </div>
          ))}
        </div>
        <input
          id="search"
          type="text"
          onChange={getAPI}
          className="text-xl min-w-36 border-2 border-black h-full w-full p-2 border-none outline-none"
        />
        {searchText && loading ? (
          <AiOutlineLoading3Quarters size={36} className={`animate-spin`} />
        ) : (
          <button
            className={dropList === "hidden" ? "rotate-180" : ""}
            onClick={handleDrop}
          >
            <RiArrowDropDownFill size={36} className="box-border" />
          </button>
        )}
      </div>

      {data.length !== 0 ? (
        <div
          className={` ${dropList} border-[1px] rounded-xl border-black overflow-scroll overflow-x-hidden h-[80%]`}
        >
          <ul>
            {data.map((value: any, key: number) => (
              <li
                onClick={() => handleNavigate(key)}
                key={key}
                className={
                  cursor === key
                    ? "border-b-[1px] border-black flex gap-2 p-4 bg-gray-300"
                    : key === data.length - 1
                    ? "border-black flex gap-2 p-4"
                    : "border-b-[1px] border-black flex gap-2 p-4"
                }
              >
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox(key)}
                  checked={checkboxStates.some(
                    (item: any) => item.id === value.id
                  )}
                  readOnly
                  className="w-6 rounded-xl"
                />

                <img
                  className="w-16 h-16 rounded-2xl"
                  src={value.image}
                  alt=""
                />
                <div className="flex flex-col items-left justify-center text-gray">
                  <h2
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatches(value.name),
                    }}
                  ></h2>
                  <span className="text-gray">
                    {value.episode.length} Episodes
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>There is Nothing</div>
      )}
      <Social />
    </div>
  );
}

export default App;
