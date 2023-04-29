"use strict";
const nav = document.querySelector("nav");
const storesSelect = document.querySelector(".stores-select");
const storeImageContainer = document.querySelector(".store-container");
const storeImg = document.querySelector(".store_img");

const storeName = document.querySelector(".storeName");
const gameCards = document.querySelector(".gameCards");
const menuButton = document.querySelector(".menuButton");
const numbOfGames = document.querySelector(".numbOfGames");
const spinerAnim = document.querySelector(".lds-ring");

const searchGames = document.querySelector(".searchBar");

const searchBtn = document.querySelector(".search");
let gameInfo = [];

let cart = [];
if (!localStorage.getItem("gamesInCart")) {
  cart = [];
} else {
  cart = JSON.parse(localStorage.getItem("gamesInCart"));
}
console.log(cart);
numbOfGames.textContent = `${cart.length}`;
///// Fetches stores

const fetchStores = async function () {
  const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const storeData = await fetchStores.json();

  console.log(storeData);

  storeData.map((element) => {
    const { storeID, storeName, isActive, images } = element;

    const storeOption = document.createElement("option");
    storeOption.dataset.id = `${storeID}`;
    storeOption.data = `${storeID}`;
    storeOption.classList.add("card");

    storeOption.innerText = `${storeName}`;
    const storeLogo = document.createElement("img");

    const { logo, banners, icon } = images;

    if (isActive === 1) {
      storeLogo.src = `https://www.cheapshark.com${logo}`;

      storesSelect.appendChild(storeOption);
      // storeImageContainer.append(storeLogo);
    }
  });

  ////makes store cards clickable and starts an api-call to get games
  const gameStores = document.querySelectorAll("[data-id]");
  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      // removeAllChildNodes(storeImageContainer);
      removeAllChildNodes(gameCards);
      fetchGames(ele.dataset.id);
      console.log(cart);
      storeImg.src = `https://www.cheapshark.com/img/stores/logos/${
        ele.dataset.id - 1
      }.png`;
      storeName.textContent = ele.textContent;
    });
  });
};
fetchStores();

///// fethces individual store games
const fetchGames = async (id, sort = "Price") => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${id}&sortBy=${sort}`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();

  console.log(gameData);
  gamesData(gameData);

  createCards(gameInfo[0]);
  console.log(cart);
};
fetchGames(1, "Price");
/// helper function to clear the whole store api call before a new one is loaded
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

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

    const gameSaved = document.createElement("div");
    gameSaved.classList.add("gameSaved");
    gameSaved.innerHTML = `<p>Game Saved to Cart</p>`;

    if (cart.some((i) => i.dealID === dealID)) {
      gameSaved.style.display = "block";
    }
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
    gameCard.appendChild(gameSaved);
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
      if (cart.some((i) => i.dealID === dealID)) {
        gameCard.style.animationName = "allreadySaved";
        setTimeout(() => {
          gameCard.style.animationName = "none";
        }, 300);
      } else if (!cart.includes(ele)) {
        gameSaved.style.display = "block";
        cart.push(ele);
        localStorage.gamesInCart = JSON.stringify(cart);

        // let existingData = localStorage.getItem("gamesInCart");

        // existingData = existingData ? existingData.split(",") : [];

        // existingData.push(ele);
        numbOfGames.textContent = `${cart.length}`;
      }
    });
  });
};
const fetchDeal = async (id) => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${id}&sortBy=Price`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();
  console.log(gameData);
};
fetchDeal(1);

const search = async (title) => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/games?title=${title}`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();
  console.log(gameData);
  createCards(gameData);
};

const searchDeals = () => {
  const textInput = searchGames.value.toLocaleLowerCase();
  console.log(searchGames);
  removeAllChildNodes(gameCards);
  search(textInput);
};

searchBtn.addEventListener("click", searchDeals);
searchGames.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    console.log("asd");
    event.preventDefault();
    searchDeals();
  }
});
