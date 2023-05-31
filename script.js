const endpoint = "https://striveschool-api.herokuapp.com/books/";
const booksRow = document.querySelector(".row");

window.addEventListener("load", fetchBooks);

if (window.location.search) {
  const params = new URLSearchParams(window.location.search);
  const asin = params.get("id");

  fetch(endpoint + asin)
    .then((raw) => raw.json())
    .then((book) => bookDetail(book))
    .catch((error) => {
      console.log("HTTP error", error);
      booksRow.innerHTML = `Ooops, something went wrong with your request`;
    });
}

function bookDetail(book) {
  console.log(book);

  const bookDetailContainer = document.createElement("div");
  bookDetailContainer.classList.add("card", "mb-3");

  const bookDetailCardRow = document.createElement("div");
  bookDetailCardRow.classList.add("row", "g-0");

  const bookDetailImgContainer = document.createElement("div");
  bookDetailImgContainer.classList.add("col-md-4", "w-auto");
  const bookDetailImg = document.createElement("img");
  bookDetailImg.src = book.img;
  bookDetailImg.classList.add("img-fluid", "rounded-start");
  bookDetailImg.alt = book.title;

  const bookDetailInfoContainer = document.createElement("div");
  bookDetailInfoContainer.classList.add("col-md-8");

  const bookDetailCardBody = document.createElement("div");
  bookDetailCardBody.classList.add("card-body");

  const bookDetailTitle = document.createElement("h5");
  bookDetailTitle.classList.add("card-title");
  bookDetailTitle.innerHTML = book.title;

  bookDetailImgContainer.append(bookDetailImg);
  bookDetailCardBody.append(bookDetailTitle);
  bookDetailInfoContainer.append(bookDetailCardBody);
  bookDetailCardRow.append(bookDetailImgContainer, bookDetailInfoContainer);

  bookDetailContainer.append(bookDetailCardRow);
  booksRow.append(bookDetailContainer);
}

function fetchBooks() {
  fetch(endpoint)
    .then((raw) => raw.json())
    .then((data) => {
      console.log(data);
      const inputSearch = document.querySelector("#inputSearch").value;

      if (inputSearch && inputSearch.length >= 3) {
        const filteredBooks = data.filter((book) =>
          book.title.toLowerCase().includes(inputSearch.toLowerCase())
        );
        showBooks(filteredBooks);
      } else {
        showBooks(data);
      }
    })
    .catch((err) => {
      console.error("HTTP error :", err);
    });
}

function showBooks(books) {
  books.forEach((book) => {
    const bookAsin = book.asin;
    const bookCategory = book.category;
    const bookImg = book.img;
    const bookPrice = book.price;
    const bookTitle = book.title;

    //creo una card per ogni book e le innesto in un div con breakpoints BS che a sua volta si innesta nella row del file HTML
    const cardContainer = document.createElement("div");
    cardContainer.classList.add(
      "cardContainer",
      "col-6",
      "col-md-6",
      "col-lg-3",
      "col-xl-2",
      "d-flex",
      "justify-content-center"
    );
    const card = document.createElement("div");
    card.classList.add("card");

    const cardImg = document.createElement("img");
    cardImg.src = `${bookImg}`;
    cardImg.classList.add("card-img-top");
    cardImg.style.maxHeight = "400px";
    cardImg.style.width = "100%";
    cardImg.alt = `${bookTitle}`;

    const specialOffer = document.createElement("span");
    specialOffer.classList.add("special-offer");
    specialOffer.style.display = "none";
    specialOffer.innerHTML = "SPECIAL DEAL";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = `${bookTitle}`;

    const cardCategory = document.createElement("article");
    cardCategory.classList.add("card-text", "card-category");
    cardCategory.innerHTML = `in ${bookCategory}`;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML = `€ ${bookPrice.toFixed(2)}`;

    const cardFooterDiv = document.createElement("div");
    cardFooterDiv.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );

    const cardMoreAnchor = document.createElement("a");
    cardMoreAnchor.href = `dettagli.html?id=${bookAsin}`;
    cardMoreAnchor.setAttribute("target", "_blank");
    cardMoreAnchor.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "cardMore"
    );
    const cardMoreIcon = document.createElement("i");
    cardMoreIcon.classList.add("bi", "bi-three-dots");
    cardMoreAnchor.append(cardMoreIcon);

    const cardCartIcon = document.createElement("i");
    cardCartIcon.classList.add("bi", "bi-cart");

    const cardJumpBtn = document.createElement("i");
    cardJumpBtn.classList.add("bi", "bi-eye-slash");

    cardFooterDiv.append(cardMoreAnchor, cardJumpBtn, cardCartIcon);

    booksRow.append(cardContainer);
    cardContainer.append(card);
    card.append(cardImg);
    card.append(specialOffer);
    card.append(cardBody);
    cardBody.append(cardTitle);
    cardBody.append(cardCategory);
    cardBody.append(cardText);
    cardBody.append(cardFooterDiv);

    if (bookPrice <= 8) {
      specialOffer.style.display = "block";
    }

    //imposto un eventListener sull'icona del carrello per ogni card che innesca la funzione addToCart
    cardCartIcon.addEventListener("click", () => {
      addToCart(cardCartIcon, bookAsin, bookTitle, bookPrice, bookImg);
    });

    cardJumpBtn.addEventListener("click", () => {
      hideThisCard(cardContainer);
    });
  });
}

function filterBooks() {
  booksRow.innerHTML = "";
  fetchBooks();
}

function hideThisCard(cardContainer) {
  cardContainer.remove();
}

//! --------------------------FUNZIONE PER GESTIRE IL CARRELLO (AGGIUNTA E RIMOZIONE)

// dichiaro un array vuoto per non permettere l'aggiunta di un elemento doppio nel carrello
let cartArr = [];
// dichiaro un array vuoto per popolarlo dei prezzi di ogni elemento aggiunto al carrello
let cartTotalArr = [];

// creo ed aggiungo alla section del carrello un messaggio di default quando il carrello è vuoto
const cartBody = document.querySelector(".modal-body");
const cartEmptyMsg = document.createElement("p");
cartEmptyMsg.classList.add("text-center");
cartEmptyMsg.innerHTML = "Nothing here, your cart is empty!";
cartBody.append(cartEmptyMsg);

//catturo l'icona del carrello nella navbar per manipolarla al momento dell'aggiunta dei prodotti al carrello
const navCart = document.querySelector("#navCart");

// inizializzo la funzione addToCart
const addToCart = (cardCartIcon, bookAsin, bookTitle, bookPrice, bookImg) => {
  // se la funzione è innescata, nella card, l'icona del carrello cambierà aspetto per indicare che l'elemento è stato correttamente aggiunto
  cardCartIcon.classList.remove("bi-cart");
  cardCartIcon.classList.add("bi-cart-check");

  // check per mandare un alert in caso si tenta di inserire nel carrello un elemento già presente nel carrello stesso
  if (cartArr.includes(bookAsin)) {
    console.log("item already in Cart");
    alert("This book is already in your Cart!");
    return;
  } else {
    // individuo i tasti di 'svuota cestino' e 'procedi al pagamento' nel carrello e gli applico un eventListener cone relativa funzione
    const cartEmptyBtn = document.querySelector("#clearCartBtn");
    cartEmptyBtn.addEventListener("click", () => {
      clearCart();
    });
    function clearCart() {
      // svuota l'<ul> che contiene i prodotti, svuota gli array per indicare qta dei prodotti nel carrelo e valore di groundTotal visibile a video, ripristina le icone del carrello nelle card a valore di 'default', riprista messaggio di carrello vuoto.
      cartEls.innerHTML = "";
      cartArr = [];
      cartTotalArr = [];
      groundTotal = cartTotalArr.reduce((total, price) => total + price, 0);
      cartTotal.innerHTML = `Partial Total (${
        cartArr.length
      } item/s): € ${groundTotal.toFixed(2)}`;
      cardCartIcon.classList.remove("bi-cart-check");
      cardCartIcon.classList.add("bi-cart");

      navCart.innerHTML = "";
      navCart.innerHTML = `<i class= 'bi bi-cart' ></i> ( ${cartArr.length} )`;

      if (cartArr.length === 0) {
        cartEmptyMsg.style.display = "block";
      }
    }

    const cartCheckoutBtn = document.querySelector("#checkoutCartBtn");
    cartCheckoutBtn.addEventListener("click", () => {
      cartCheckout();
    });
    function cartCheckout() {
      // svuolta l'<ul> che contiene i prodotti, crea un elemento che contiene un messaggio e ne imposta un timeout per scomparire, svuota gli array per indicare qta dei prodotti e valore del carrello, ripristina il messaggio di carrello vuoto a video con un delay.
      cartEls.innerHTML = "";

      const checkoutSuccessMsg = document.createElement("h5");
      checkoutSuccessMsg.id = "checkoutMsg";
      checkoutSuccessMsg.innerHTML = `Your order has been processed successfully.<br>Thank you!`;
      cartBody.append(checkoutSuccessMsg);
      setTimeout(() => {
        checkoutSuccessMsg.remove();
      }, 5000);

      cartArr = [];
      cartTotalArr = [];
      groundTotal = cartTotalArr.reduce((total, price) => total + price, 0);
      cartTotal.innerHTML = `Partial Total (${
        cartArr.length
      } item/s): € ${groundTotal.toFixed(2)}`;
      cardCartIcon.classList.remove("bi-cart-check");
      cardCartIcon.classList.add("bi-cart");

      if (cartArr.length === 0) {
        cartEmptyMsg.style.display = "block";
        cartEmptyMsg.style.visibility = "hidden";
        setTimeout(() => {
          cartEmptyMsg.style.visibility = "visible";
        }, 3000);
        // cartCheckoutBtn.removeEventListener("click", cartCheckout());
      }

      navCart.innerHTML = "";
      navCart.innerHTML = `<i class= 'bi bi-cart' ></i> ( ${cartArr.length} )`;
    }

    // se il prodotto non è già presente nel carrello, si procede a popolare gli array vuoti e popolare la sezione 'Carrello' nel file HTML
    cartArr.push(bookAsin);
    cartTotalArr.push(bookPrice);

    // dichiaro una variabile a 0 per indicare il valore totale di partenza del carrello
    let groundTotal = 0;

    // itero l'array contenente i prezzi degli articoli inseriti per assegnare il valore della somma degli stessi alla variabile 'groundTotal'
    cartTotalArr.forEach((indexValue) => {
      groundTotal += indexValue;
    });

    const cartEls = document.querySelector(".cartEls");
    const cartEl = document.createElement("li");
    cartEl.classList.add(
      "mb-3",
      "d-flex",
      "justify-content-between",
      "cartElement"
    );
    const removeSingleEl = document.createElement("span");
    const removeFromCart = document.createElement("i");
    const cartTotal = document.querySelector(".cart-total-sum");

    removeFromCart.classList.add(
      "bi",
      "bi-trash",
      "pe-3",
      "ms-3",
      "d-flex",
      "flex-row-reverse",
      "gap-5",
      "align-items-center"
    );
    removeFromCart.innerHTML = `€ ${bookPrice.toFixed(2)}`;
    removeFromCart.style.fontStyle = "normal";
    removeFromCart.style.fontWeight = "500";
    removeFromCart.style.fontSize = "1.2rem";
    removeSingleEl.append(removeFromCart);
    cartEl.innerHTML = `${bookTitle}`;

    cartEl.append(removeSingleEl);
    cartEls.append(cartEl);
    cartEmptyMsg.style.display = "none";

    // svuoto il tag 'h5' di riga 115 del file HTML per ri-popolarlo con le informazioni aggiornate in base agli articoli aggiunti nel carrello
    cartTotal.innerHTML = "";
    cartTotal.innerHTML = `Partial Total (${
      cartArr.length
    } item/s): € ${groundTotal.toFixed(2)}`;

    //svuoto il contenuto dell'icona Carrello nella navbar per ripopolarla con le info aggiornate
    navCart.style.animation = "cartFilled 2s ease-in-out";
    navCart.innerHTML = "";
    navCart.innerHTML = `<i class= 'bi bi-cart' ></i> ( ${cartArr.length} )`;

    // assegno un eventListener all'icona del cestino su ogni elemento creato nel carrello che inizializza al 'click' la funzione 'removeLi'
    removeFromCart.addEventListener("click", () => {
      removeLi(
        cartEl,
        cartEls,
        cardCartIcon,
        cartArr,
        cartTotal,
        groundTotal,
        cartTotalArr
      );
    });

    // richiamo la funzione 'removeLi'
    const removeLi = (
      cartEl,
      cartEls,
      cardCartIcon,
      cartArr,
      cartTotal,
      groundTotal,
      cartTotalArr
    ) => {
      // rimuovo dall'array contenente gli ASIN dei prodotti nel carrello, l'ASIN del prodotto su cui è stata innescata la funzione per aggiornare il numero di articoli presenti nel totale a video
      const asinIndex = cartArr.indexOf(bookAsin);
      if (asinIndex !== -1) {
        cartArr.splice(asinIndex, 1);
      }

      // rimuovo dall'array contenente i prezzi dei prodotti nel carrello, il prezzo del prodotto su cui è stata innecata la funzione per aggiornare il 'groundTotal' e quindi il prezzo totale degli articoli presenti nel carrello a video
      const priceIndex = cartTotalArr.indexOf(bookPrice);
      if (priceIndex !== -1) {
        cartTotalArr.splice(priceIndex, 1);
      }

      // innescata la funzione il li contente le info di un elemento aggiunto verrà rimosso dalla lista non ordinata (ul)
      cartEls.removeChild(cartEl);

      groundTotal = cartTotalArr.reduce((total, price) => total + price, 0);

      cartTotal.innerHTML = `Partial Total (${
        cartArr.length
      } item/s): € ${groundTotal.toFixed(2)}`;

      //rimosso l'elemento dal carrello, non facendone più parte, nella rispettiva card, a video, verrà cambiata nuovamente l'icona del carrello per far capire che tale articolo NON è presente nel carrello
      cardCartIcon.classList.remove("bi-cart-check");
      cardCartIcon.classList.add("bi-cart");

      navCart.innerHTML = "";
      navCart.innerHTML = `<i class= 'bi bi-cart' ></i> ( ${cartArr.length} )`;

      if (cartArr.length === 0) {
        cartEmptyMsg.style.display = "block";
      }
    };
  }
};
