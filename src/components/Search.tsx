import { RiArrowDropDownFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { fetchData } from "../api";

function Search() {
  const [data, setData] = useState<any[]>([]);
  const [cursor, setCursor] = useState<number>(0);
  const [checkboxStates, setCheckboxStates] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [dropList, setDropList] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [cursor, data]);

  const handleCheckbox = (index: number) => {
    const character = data[index];
    const isChecked = checkboxStates.some((item) => item.id === character.id);
    setCheckboxStates((prevCheckboxStates) =>
      isChecked
        ? prevCheckboxStates.filter((item) => item.id !== character.id)
        : [...prevCheckboxStates, character]
    );
  };

  const handleCheckboxWithId = (id: any) => {
    setCheckboxStates((prevCheckboxStates) =>
      prevCheckboxStates.filter((item) => item.id !== id)
    );
  };

  const handleDrop = () => {
    setDropList(dropList === "hidden" ? "" : "hidden");
  };

  const handleNavigate = (key: number) => {
    setCursor(key);
  };

  const getAPI = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    setLoading(true);

    try {
      if (!value) {
        setData([]);
      } else {
        const searchData = await fetchData(value);
        if (typeof searchData !== "object") {
          setError(searchData);
          setData([]);
        } else {
          setData(searchData);
          setError(""); // Clear any previous error message
        }
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error || "An error occurred while fetching data."
      );
      setData([]);
    } finally {
      setLoading(false);
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
            <div
              key={key}
              className="flex gap-2 rounded-xl bg-gray-300 p-2 items-center text-nowrap"
            >
              {value.name}
              <div
                onClick={() => handleCheckboxWithId(value.id)}
                className="text-white bg-gray-400 rounded-md p-1 cursor-pointer"
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
          placeholder="ex: Rick"
          className="text-xl min-w-36 border-2 border-black h-full w-full p-2 border-none outline-none"
        />
        {searchText && loading ? (
          <AiOutlineLoading3Quarters size={36} className="animate-spin" />
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
                    ? "border-b-[1px] border-black flex items-center gap-2 p-4 bg-gray-300"
                    : key === data.length - 1
                    ? "border-black flex gap-2 p-4"
                    : "border-b-[1px] border-black flex items-center gap-2 p-4"
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
        <div>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Search;
