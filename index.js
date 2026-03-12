const output = document.getElementById("output");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const pageNum = document.getElementById("pageNum");

async function getData(num) {
  try {
    output.textContent = "Loading...";
    output.className =
      "text-4xl flex justify-center bg-black text-white py-4 mx-60 mt-30";
    const res = await fetch("https://swapi.dev/api/people/?page=" + num);
    if (res.status == 403 || res.status == 429) {
      showError(res.status);
      return;
    }
    if (!res.ok) {
      throw new Error(`Failed fetch at ${url} with ${res.status}.`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  } finally {
    output.className = "grid grid-cols-2 gap-2";
  }
}

async function getHomeworld(homeworldUrl) {
  try {
    const res = await fetch(homeworldUrl);
    if (!res.ok) {
      throw new Error("Error fetching Homeworld.");
    }
    const { name } = await res.json();
    return name;
  } catch (error) {
    console.error(error);
  }
}

function showError(statusNum) {
  output.textContent = "";
  const errorP = document.createElement("p");
  switch (statusNum) {
    case 403:
      errorP.innerText = `Error getting data: 403 Forbidden!`;
      break;
    case 429:
      errorP.innerText = `Error getting data: 429 Too Many Requests!`;
      break;
  }
  output.appendChild(errorP);
}

//misunderstood assignment, but still useful knowledge
async function getAPICount() {
  try {
    const res = await fetch("https://swapi.dev/api/people");
    if (!res.ok) {
      console.error("Error getting API Cap, defaulting to 20.");
      return 20;
    }
    const { count } = await res.json();
    return count;
  } catch (error) {
    console.log(error);
  }
}

async function renderData(obj) {
  output.textContent = "";
  obj.results.forEach(async (obj) => {
    const { name } = obj,
      { homeworld } = obj,
      { hair_color } = obj,
      { mass } = obj,
      { height } = obj;
    const homeworldName = await getHomeworld(homeworld);
    const paraClass = "text-md text-center";

    const cardDiv = document.createElement("div");
    output.appendChild(cardDiv);
    cardDiv.className =
      "flex flex-col bg-black text-white gap-2 justify-center p-2 rounded-2xl mt-2 mx-4";

    const nameElement = document.createElement("h3");
    nameElement.innerText = `Name: ${name}`;
    nameElement.className =
      "text-2xl text-center bg-gray-800 rounded-2xl outline-white outline-2 p-2";
    cardDiv.appendChild(nameElement);

    const massElement = document.createElement("p");
    massElement.innerText = `Mass: ${mass}`;
    massElement.className = paraClass;
    cardDiv.appendChild(massElement);

    const hairElement = document.createElement("p");
    hairElement.innerText = `Hair color: ${hair_color}`;
    hairElement.className = paraClass;
    cardDiv.appendChild(hairElement);

    const heightElement = document.createElement("p");
    heightElement.innerText = `Height: ${height}cm`;
    heightElement.className = paraClass;
    cardDiv.appendChild(heightElement);

    const homeworldNameElement = document.createElement("p");
    homeworldNameElement.innerText = `Homeworld: ${homeworldName}`;
    homeworldNameElement.className = paraClass;
    cardDiv.appendChild(homeworldNameElement);
  });
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiCount = 82;
  const apiCap = 9;
  let currentAPI = 1;
  pageNum.innerText = `Page: ${currentAPI} (${currentAPI * 10 - 9} - ${currentAPI * 10}) of ${apiCount}`;
  let areButtonsOff = false;

  prev.addEventListener("click", async () => {
    if (areButtonsOff) {
      return;
    }
    if (currentAPI < 2) {
      return;
    }
    areButtonsOff = true;

    currentAPI--;
    const data = await getData(currentAPI);
    pageNum.innerText = `Page: ${currentAPI} (${currentAPI * 10 - 9} - ${currentAPI * 10}) of ${apiCount}`;
    await renderData(data);
    areButtonsOff = false;
  });
  next.addEventListener("click", async () => {
    if (areButtonsOff) {
      return;
    }
    if (currentAPI + 1 > apiCap) {
      return;
    }
    areButtonsOff = true;
    currentAPI++;
    const data = await getData(currentAPI);
    if (currentAPI !== 9) {
      pageNum.innerText = `Page: ${currentAPI} (${currentAPI * 10 - 9} - ${currentAPI * 10}) of ${apiCount}`;
    } else {
      pageNum.innerText = `Page: ${currentAPI} (${currentAPI * 10 - 9} - 82)/82`;
    }
    await renderData(data);
    areButtonsOff = false;
  });

  const person = await getData(currentAPI);
  renderData(person);
}

main();
