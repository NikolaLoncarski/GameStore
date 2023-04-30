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

numbOfGames.textContent = `${cart.length}`;
///// Fetches stores

const fetchStores = async function () {
  const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const storeData = await fetchStores.json();

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
    }
  });

  ////makes store cards clickable and starts an api-call to get games
  const gameStores = document.querySelectorAll("[data-id]");
  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      removeAllChildNodes(gameCards);
      fetchGames(ele.dataset.id);

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

  gamesData(gameData);

  createCards(gameInfo[0]);
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
      name,
      gameID,
    } = ele;
    console.log(ele);
    const unixTime = releaseDate * 1000;
    const date = new Date(unixTime);
    let discount;
    if (savings) {
      discount = parseFloat(savings).toFixed(1);
    } else {
      discount = "0";
    }
    ////overall card div
    const gameCard = document.createElement("div");
    gameCard.classList.add("game");
    gameCard.dataset.id = `${dealID || gameID}`;

    const gameTitle = document.createElement("h4");
    gameTitle.classList.add("gameTitle");
    gameTitle.innerText = `${title || name}`;

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
    normPrice.innerText = `Normal Price:${normalPrice || salePrice}`;

    const price = document.createElement("span");
    price.classList.add("price");
    price.innerText = `Current Price:${salePrice}$`;

    const moneySaved = document.createElement("span");
    moneySaved.classList.add("moneySaved");
    moneySaved.innerText = `Money Saved:${discount || none}%`;

    const saveButton = document.createElement("button");
    saveButton.classList.add("saveButton");
    saveButton.innerText = "Save to Cart";

    const gameSaved = document.createElement("div");
    gameSaved.classList.add("gameSaved");
    gameSaved.innerHTML = `<p>Game Saved to Cart</p>`;
    console.log(cart);

    if (cart.some((i) => i.gameID === gameID)) {
      gameSaved.style.display = "block";
    } else {
      gameSaved.style.display = "none";
    }

    console.log(cart.some((i) => i.gameID === gameID));
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
      gameInfoLink.text = "More Info not available";
    }
    gameCard.appendChild(gameInfoLink);

    saveButton.addEventListener("click", () => {
      console.log(cart);
      if (cart.some((i) => i.gameID === gameID)) {
        gameCard.style.animationName = "allreadySaved";
        setTimeout(() => {
          gameCard.style.animationName = "none";
        }, 300);
      } else {
        gameSaved.style.display = "block";
        cart.push(ele);
        localStorage.gamesInCart = JSON.stringify(cart);

        numbOfGames.textContent = `${cart.length}`;
      }
    });
  });
};

const search = async (title) => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/games?title=${title}`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();

  createDeals(gameData);
};

const searchDeals = () => {
  removeAllChildNodes(storeImageContainer);
  const textInput = searchGames.value.toLocaleLowerCase();

  removeAllChildNodes(gameCards);
  search(textInput);
};

searchBtn.addEventListener("click", searchDeals);
searchGames.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchDeals();
  }
});

const createDeals = (data) => {
  data.map((ele) => {
    const { cheapest, external, gameID, thumb } = ele;

    const dealCard = document.createElement("div");
    dealCard.classList.add("deal");
    dealCard.dataset.id = `${gameID}`;

    const dealInfo = document.createElement("div");
    dealInfo.classList.add("dealInfo");

    const externalName = document.createElement("h4");
    externalName.classList.add("external");
    externalName.innerText = `${external}`;

    const dealImgContainer = document.createElement("div");
    dealImgContainer.classList.add("dealImgContainer");

    const gameThumb = document.createElement("img");
    gameThumb.src = `${thumb}`;
    dealImgContainer.append(gameThumb);

    const dealPrice = document.createElement("h4");
    dealPrice.classList.add("dealPrice");
    dealPrice.innerText = `${cheapest}`;

    const gameLookupBtn = document.createElement("button");
    gameLookupBtn.classList.add("gameLookupBtn");
    gameLookupBtn.innerText = "Go to game";

    dealInfo.append(externalName);
    dealInfo.append(dealPrice);
    dealInfo.append(gameLookupBtn);

    dealCard.append(dealImgContainer);
    dealCard.append(dealInfo);

    gameCards.append(dealCard);
    gameLookupBtn.addEventListener("click", () => {
      removeAllChildNodes(gameCards);
      searchGamesID(gameID);
    });
  });
};

const searchGamesID = async (id) => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/games?id=${id}`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();

  makeDeals(gameData);
};
const makeDeals = (data) => {
  const { cheapestPriceEver, deals, info } = data;
  deals.map((item) => {
    const { storeID, dealID, price } = item;

    searchDealsID(dealID);
  });
};
const searchDealsID = async (id) => {
  spinerAnim.style.display = "inline-block";
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?id=${id}`
  );
  spinerAnim.style.display = "none";
  const gameData = await fetchGameData.json();

  createCards([gameData.gameInfo]);
};
