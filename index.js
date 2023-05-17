"use strict";
const nav = document.querySelector("nav");
const storesSelect = document.querySelector(".stores-select");
const storeImageContainer = document.querySelector(".store-container");
const storeImg = document.querySelector(".store_img");
const priceSlider = document.querySelector(".priceSlider");
const storeName = document.querySelector(".storeName");
const gameCards = document.querySelector(".gameCards");
const menuButton = document.querySelector(".menuButton");
const numbOfGames = document.querySelector(".numbOfGames");
const spinerAnim = document.querySelector(".spinner");
const maxPrice = document.querySelector(".max-price");
const searchGames = document.querySelector(".searchBar");
const checkboxMenu = document.querySelector(".checkbox");
const hamMenuItems = document.querySelector(".menu-items");

////-----Displays on wrong search query-------////
const errorContainer = document.querySelector(".error");
const createError = document.createElement("h2");

createError.textContent = "No Results Found";

/////////--------------------- / /---------------////////
const hamMenuCheck = function (e) {
  if (e.target != checkboxMenu && e.target != maxPrice) {
    console.log(hamMenuItems);
    checkboxMenu.checked = false;
    document.removeEventListener("click", hamMenuCheck);
    console.log("k");
  }
};

checkboxMenu.addEventListener("click", function () {
  if (this.checked) {
    document.addEventListener("click", hamMenuCheck);
  }
});

const searchBtn = document.querySelector(".search");
let gameInfo = [];
let maximumPrice = 50;
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

    const storeOption = document.createElement("p");
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

  storesSelect.addEventListener("change", (e) => {
    console.log(e);
  });

  ////makes store cards clickable and starts an api-call to get games
  const gameStores = document.querySelectorAll("[data-id]");
  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      removeAllChildNodes(gameCards);

      fetchGames(ele.dataset.id, maximumPrice);

      storeImg.src = `https://www.cheapshark.com/img/stores/logos/${
        ele.dataset.id - 1
      }.png`;
      storeName.textContent = ele.textContent;
    });
  });
};
fetchStores();

///// fethces individual store games
const fetchGames = async (id, price) => {
  storeImageContainer.style.opacity = "0";
  spinerAnim.style.display = "inline-block";

  console.log(price);
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${id}&upperPrice=${price}&sortBy=Release`
  );
  spinerAnim.style.display = "none";
  storeImageContainer.style.opacity = "1";
  const gameData = await fetchGameData.json();
  console.log(gameData);
  gamesData(gameData);

  createCards(gameInfo[0]);
};
fetchGames(1, maximumPrice);
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
  removeAllChildNodes(errorContainer);
  cardElements.map((ele, i) => {
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
    animationDelay(gameCard, i);
    const gameTitle = document.createElement("h4");
    gameTitle.classList.add("gameTitle");
    gameTitle.innerText = `${title || name}`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("imageContainer");

    const gameThumb = document.createElement("img");
    gameThumb.src = `${thumb}`;
    const gameHeading = document.createElement("div");
    gameHeading.classList.add("gameCardHeading");

    const gameInfoBox = document.createElement("div");
    gameInfoBox.classList.add("gameInfoBox");

    //--------------Prices ------------//
    const gamePrices = document.createElement("div");
    gamePrices.classList.add("gamePrices");

    const normPrice = document.createElement("span");
    normPrice.classList.add("normPrice");
    normPrice.innerText = `Price on release: ${normalPrice || salePrice}$`;

    const price = document.createElement("span");
    price.classList.add("price");
    price.innerText = `Current Price: ${salePrice}$`;

    const mainPrice = document.createElement("span");
    mainPrice.classList.add("mainPrice");
    mainPrice.textContent = `${salePrice}$`;

    const moneySaved = document.createElement("span");
    moneySaved.classList.add("moneySaved");
    moneySaved.innerText = `Discount: ${discount} %`;

    const saveButton = document.createElement("button");
    saveButton.classList.add("saveButton");
    saveButton.innerText = "Wish";

    const unwishBtn = document.createElement("button");
    unwishBtn.classList.add("unwishBtn");
    unwishBtn.textContent = "unwish";

    const gameSaved = document.createElement("div");
    gameSaved.classList.add("gameSaved");
    gameSaved.innerHTML = `<p>Wished</p>`;

    if (cart.some((i) => i.gameID === gameID)) {
      gameSaved.style.display = "block";
      gameCard.style.border = "2px solid #6b21a8 ";
      unwishBtn.style.display = "block";
    } else {
      gameSaved.style.display = "none";
    }

    ///Game card pre-hover State
    imageContainer.append(gameThumb);
    gameHeading.append(imageContainer);
    gameHeading.append(gameTitle);
    gameHeading.append(mainPrice);

    gamePrices.appendChild(normPrice);
    gamePrices.appendChild(moneySaved);
    gamePrices.appendChild(price);
    ///---------------//-----------------------//
    const gameReleaseDate = document.createElement("span");
    gameReleaseDate.classList.add("gameDate");

    if (date > 0) {
      gameReleaseDate.innerText = `Release Date : ${date.toLocaleDateString(
        "en-US"
      )}`;
    } else {
      gameReleaseDate.innerText = "Release Date:N/A";
    }

    ///Check if there is a realse date information
    const gameInfoLink = document.createElement("a");
    const metacriticIcon = document.createElement("img");
    gameInfoLink.classList.add("metacritic");
    metacriticIcon.src = "./metacritic.png";
    metacriticIcon.alt = "Metacritic icon";

    gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
    if (metacriticLink) {
      gameInfoLink.target = "_blank";
    } else {
      gameInfoLink.style.pointerEvents = "none";
      gameInfoLink.text = "More Info not available";
    }
    gameCard.prepend(gameHeading);
    gameCard.append(gameInfoBox);
    gameInfoBox.append(gamePrices);
    gameInfoBox.append(gameReleaseDate);
    gameInfoBox.append(saveButton);
    gameInfoBox.append(gameInfoLink);
    gameInfoBox.append(unwishBtn);
    gameCard.appendChild(gameSaved);
    gameCards.appendChild(gameCard);
    gameInfoLink.append(metacriticIcon);

    saveButton.addEventListener("click", () => {
      unwishBtn.style.display = "block";
      if (cart.some((i) => i.gameID === gameID)) {
        gameCard.style.animationDelay = "0s";
        gameCard.style.animationName = "allreadySaved";
        gameCard.style.border = "2px solid #6b21a8 ";

        setTimeout(() => {
          gameCard.style.animationName = "none";
        }, 300);
      } else {
        gameCard.style.border = "2px solid #6b21a8 ";
        gameSaved.style.display = "block";
        cart.push(ele);
        localStorage.gamesInCart = JSON.stringify(cart);

        numbOfGames.textContent = `${cart.length}`;
      }
    });

    unwishBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const localStorageGames = JSON.parse(localStorage.getItem("gamesInCart"));
      const removeGame = localStorageGames.filter(
        (item) => item.title !== title
      );
      localStorage.setItem("gamesInCart", JSON.stringify(removeGame));
      if (removeGame) {
        unwishBtn.style.display = "none";
        gameCard.style.border = "none";
        cart = JSON.parse(localStorage.getItem("gamesInCart"));
        gameSaved.style.display = "none";
        numbOfGames.textContent = cart.length;
        console.log(cart);
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
  // removeAllChildNodes(storeImageContainer);
  const textInput = searchGames.value.toLocaleLowerCase();

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
  ///----- displays an error message if there are no search results found ----///
  removeAllChildNodes(errorContainer);
  removeAllChildNodes(storeImageContainer);
  if (data.length === 0) {
    errorContainer.append(createError);
  }
  ////////-------------///////
  removeAllChildNodes(gameCards);
  data.map((ele, i) => {
    const { cheapest, external, gameID, thumb } = ele;

    const dealCard = document.createElement("div");
    dealCard.classList.add("deal");
    dealCard.dataset.id = `${gameID}`;

    animationDelay(dealCard, i);

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
    gameLookupBtn.classList.add("saveButton");
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

///------creates animation delay ----------/////
const animationDelay = (ele, i) => {
  ele.style.animationDelay = `${0.05 * i}s`;
};

//////----------sets the maximum price on games api call --------///////
maxPrice.addEventListener("change", () => {
  maximumPrice = +maxPrice.value;
});
