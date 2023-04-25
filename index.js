"use strict";
const nav = document.querySelector("nav");
const storesNav = document.querySelector(".stores-Side-Nav");
const gameCards = document.querySelector(".gameCards");
const menuButton = document.querySelector(".menuButton");
let cart = [];
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

  ////makes store cards clickable and starts an api-call to get games
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
  storeData(gameData);
  const createCards = (cardElements) => {
    cardElements.map((ele) => {
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
      gameTitle.classList.add("gameTitle");
      gameTitle.innerText = title;

      const gameThumb = document.createElement("img");
      gameThumb.src = `${thumb}`;

      //--------------Prices ------------//
      const gamePrices = document.createElement("div");
      gamePrices.classList.add("gamePrices");

      const normPrice = document.createElement("span");
      normPrice.classList.add("normPrice");
      normPrice.innerText = `Normal Price:${normalPrice}$`;

      const price = document.createElement("span");
      price.classList.add("price");
      price.innerText = `Current Price:${salePrice}$`;

      const moneySaved = document.createElement("span");
      moneySaved.classList.add("moneySaved");
      moneySaved.innerText = `Money Saved:${parseFloat(savings).toFixed(1)}%`;

      const saveButton = document.createElement("button");
      saveButton.classList.add("saveButton");
      saveButton.innerText = "Save to Cart";

      gamePrices.appendChild(normPrice);
      gamePrices.appendChild(moneySaved);
      gamePrices.appendChild(price);
      ///---------------//-----------------------//
      const gameReleaseDate = document.createElement("span");
      gameReleaseDate.classList.add("gameDate");

      if (date > 0) {
        gameReleaseDate.innerText = `Release Date:${date.toLocaleDateString(
          "en-US"
        )}`;
      } else {
        gameReleaseDate.innerText = "Release Date:N/A";
      }

      gameCard.appendChild(gameTitle);
      gameCard.prepend(gameThumb);
      gameCard.append(gamePrices);
      gameCard.append(gameReleaseDate);
      gameCard.append(saveButton);
      gameCards.appendChild(gameCard);
      ///Check if there is a realse date information
      if (metacriticLink) {
        const gameInfoLink = document.createElement("a");
        gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
        gameInfoLink.target = "_blank";
        gameInfoLink.text = "More Info...";
        gameCard.appendChild(gameInfoLink);
      }
      saveButton.addEventListener("click", () => {
        storeData(ele);
      });
    });
  };
  createCards(gameData);
};

/// helper function to clear the whole store api call before a new one is loaded
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

menuButton.addEventListener("click", () => {
  if (storesNav.style.display !== "none") {
    storesNav.style.display = "none";
  } else {
    storesNav.style.display = "flex";
  }
});
function storeData(data) {
  cart.push(data);
  console.log(cart);
}
