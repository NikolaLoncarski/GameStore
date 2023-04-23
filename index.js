"use strict";
const storesNav = document.querySelector(".stores-Side-Nav");
const gameCards = document.querySelector(".gameCards");

//--------------
const getGames = async function () {
  const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const storeData = await fetchStores.json();
  console.log(storeData);
  storeData.map((element) => {
    const { storeID, storeName, isActive, images } = element;
    const listItem = document.createElement("li");
    const name = document.createElement("h2");

    listItem.dataset.id = `${storeID}`;
    const storeLogo = document.createElement("img");
    const { logo, banners, icon } = images;
    name.innerText = `${storeName}`;
    listItem.data = `${storeID}`;

    listItem.classList.add("card");

    if (isActive === 1) {
      storeLogo.src = `https://www.cheapshark.com${logo}`;
      listItem.appendChild(storeLogo);
      storesNav.appendChild(listItem);
      listItem.appendChild(name);
    }
  });

  /////-------------
  const gameStores = document.querySelectorAll("[data-id]");

  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      fetchGames(ele.dataset.id);
    });
  });
};
getGames();

////--------

const fetchGames = async (id) => {
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${id}`
  );

  const gameData = await fetchGameData.json();
  console.log(gameData);
  removeAllChildNodes(gameCards);
  gameData.map((ele) => {
    const {
      title,
      dealID,
      normalPrice,
      releaseDate,
      salePrice,
      savings,
      thumb,
    } = ele;
    const unixTime = releaseDate * 1000;
    const date = new Date(unixTime);
    const gameCard = document.createElement("div");
    const gameTitle = document.createElement("h4");
    const gameThumb = document.createElement("img");
    const normPrice = document.createElement("span");
    const gameReleaseDate = document.createElement("span");

    gameCard.classList.add("game");
    normPrice.classList.add("normPrice");
    gameReleaseDate.classList.add("gameDate");

    gameCard.dataset.id = `${dealID}`;
    gameTitle.innerText = title;
    gameThumb.src = `${thumb}`;
    normPrice.innerText = `${normalPrice}`;
    if (date > 0) {
      gameReleaseDate.innerText = `Release Date:${date.toLocaleDateString(
        "en-US"
      )}`;
    } else {
      gameReleaseDate.innerText = "Release Date:N/A";
    }

    gameCard.appendChild(gameTitle);
    gameCards.appendChild(gameCard);
    gameCard.prepend(gameThumb);
    gameCard.append(normPrice);
    gameCard.append(gameReleaseDate);
  });
};
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
