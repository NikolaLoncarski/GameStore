"use strict";
const storesNav = document.querySelector(".stores-Side-Nav");
const gameCards = document.querySelector(".gameCards");

///// Fetches stores
const fetchStores = async function () {
  const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const storeData = await fetchStores.json();

  console.log(storeData);

  storeData.map((element) => {
    const { storeID, storeName, isActive, images } = element;

    const listItem = document.createElement("li");
    listItem.dataset.id = `${storeID}`;
    listItem.data = `${storeID}`;
    listItem.classList.add("card");

    const name = document.createElement("h2");
    name.innerText = `${storeName}`;
    const storeLogo = document.createElement("img");

    const { logo, banners, icon } = images;

    if (isActive === 1) {
      storeLogo.src = `https://www.cheapshark.com${logo}`;
      listItem.appendChild(storeLogo);
      storesNav.appendChild(listItem);
      listItem.appendChild(name);
    }
  });

  ////makes store cards clicable and starts a api call to get games
  const gameStores = document.querySelectorAll("[data-id]");
  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      fetchGames(ele.dataset.id);
    });
  });
};
fetchStores();

///// fethces individual store games
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
      metacriticLink,
    } = ele;
    const unixTime = releaseDate * 1000;
    const date = new Date(unixTime);
    ////overall card div
    const gameCard = document.createElement("div");
    gameCard.classList.add("game");
    gameCard.dataset.id = `${dealID}`;

    const gameTitle = document.createElement("h4");
    gameTitle.innerText = title;

    const gameThumb = document.createElement("img");
    gameThumb.src = `${thumb}`;

    const normPrice = document.createElement("span");
    normPrice.classList.add("normPrice");
    normPrice.innerText = `${normalPrice}`;

    const gameReleaseDate = document.createElement("span");
    gameReleaseDate.classList.add("gameDate");

    const gameInfoLink = document.createElement("a");
    gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
    gameInfoLink.target = "_blank";
    gameInfoLink.text = "More Info...";

    ///Check if there is a realse date information
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
    gameCard.appendChild(gameInfoLink);
  });
};

/// helper function to clear the whole store api call before a new one is loaded
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
