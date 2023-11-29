import { useState } from "react";

const FilterNav = ({ setSearchParams, todos }) => {
  const [filterOn, setFilterOn] = useState("");
  const [filteredValue, setFilteredValue] = useState("");

  function openFilterInput(type) {
    setFilteredValue("");
    setFilterOn(type);
  }

  function handleSearchParams() {
    if (filterOn === "completed") {
      if (filteredValue !== "false" && filteredValue !== "true") {
        setFilteredValue("");
        setSearchParams("");
        return;
      }
    }
    setSearchParams(`&${filterOn}=${filteredValue}`);
  }

  return (
    <nav id="todosFilterNav">
      <h3>Filter by: </h3>
      <button
        type="button"
        className="todosFilterBtn"
        onClick={() => openFilterInput("id")}
      >
        id
      </button>
      <button
        type="button"
        className="todosFilterBtn"
        onClick={() => openFilterInput("title")}
      >
        title
      </button>
      {todos && (
        <button
          type="button"
          className="todosFilterBtn"
          onClick={() => openFilterInput("completed")}
        >
          completed
        </button>
      )}

      <button
        type="button"
        className="todosFilterBtn"
        onClick={() => {
          setSearchParams("");
          setFilterOn("");
        }}
      >
        reset filter
      </button>

      {filterOn.length > 0 && (
        <>
          <input
            type="text"
            value={filteredValue}
            onChange={(e) => {
              setFilteredValue(e.target.value);
            }}
          />
          <button type="button" onClick={handleSearchParams}>
            Filter {filterOn}
          </button>
        </>
      )}
    </nav>
  );
};

export default FilterNav;
