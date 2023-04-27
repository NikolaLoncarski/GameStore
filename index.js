"use strict";
const nav = document.querySelector("nav");
const storesNav = document.querySelector(".stores-Side-Nav");
const gameCards = document.querySelector(".gameCards");
const menuButton = document.querySelector(".menuButton");
const numbOfGames = document.querySelector(".numbOfGames");
const errorModal = document.querySelector(".Error");
let gameInfo = [];

let cart = [];
if (!localStorage.getItem("gamesInCart")) {
  cart = [];
} else {
  cart = JSON.parse(localStorage.getItem("gamesInCart"));
}

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
      removeAllChildNodes(gameCards);
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
  gamesData(gameData);

  createCards(gameInfo[0]);
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

////------stores data in an array outside the api call--------/////////
function gamesData(games) {
  gameInfo = [];
  gameInfo.push(games);
}
function cartGames(games) {
  cart.push(games);
}

////--------creates new dom elements from the new array-------///////
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

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("imageContainer");

    const gameThumb = document.createElement("img");
    gameThumb.src = `${thumb}`;

    imageContainer.append(gameThumb);
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
    gameCard.prepend(imageContainer);
    gameCard.append(gamePrices);
    gameCard.append(gameReleaseDate);
    gameCard.append(saveButton);
    gameCards.appendChild(gameCard);

    ///Check if there is a realse date information
    const gameInfoLink = document.createElement("a");
    gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
    if (metacriticLink) {
      gameInfoLink.target = "_blank";
      gameInfoLink.text = "More Information";
    } else {
      gameInfoLink.text = "More Information not available";
    }
    gameCard.appendChild(gameInfoLink);

    saveButton.addEventListener("click", () => {
      errorModal.classList.remove("displayError");
      if (!cart.includes(ele)) {
        cart.push(ele);
        numbOfGames.textContent = `${cart.length - 1}`;

        let existingData = localStorage.getItem("gamesInCart");

        existingData = existingData ? existingData.split(",") : [];

        existingData.push(ele);

        localStorage.gamesInCart = JSON.stringify(cart);
      } else {
        errorModal.classList.add("displayError");
      }
    });
  });
};
