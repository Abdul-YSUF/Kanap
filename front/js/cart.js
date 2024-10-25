// Récupération produits enregistrés dans le Local Storage
let getLocalStorage = JSON.parse(localStorage.getItem("product"));
// Les variables
const orderButton = document.getElementById("order");
const cartItems = document.getElementById("cart__items");
let products = [];

// Récupération Data API Produits
fetch("https://comfy-pony-4d1729.netlify.app/api/products")
.then((res) => res.json())
.then((data) => {
    if (getLocalStorage) {
        for (article of getLocalStorage) {
            const product = data.find(dataProduct => dataProduct._id === article.id);
            if (product) { // Affectation prix, imageUrl, altTxt et nom au produit du Local Storage
                article.price = product.price;
                article.image = product.imageUrl;
                article.alt = product.altTxt;
                article.name = product.name;
            }
        }
    }

//Affichage message si le panier est vide et Empêcher l'utilisateur commander un panier vide
if(getLocalStorage === null || getLocalStorage === 0) {
  // On bloque Event Listener pour éviter l'utilisateur commander un panier vide
  orderButton.addEventListener("click", (e) => {
      alert("⚠️ Votre panier est vide, Veuillez selectionner au moins un produit avant de passer la commande.");
      e.preventDefault();
    });
    cartItems.innerHTML =
    `<div>
        <p style="text-align:center; font-size:24px;">⚠️ Votre panier est tristement vide. <br> <br> Veuillez sélectionner au moins un produit depuis la <a href="index.html" style="color:#2C3E50;"><b>Page d'accueil<b></a></p>
    </div>`;
} else { // Affichage produits depuis Local Storage si le panier n'est pas vide
    // Boucle for pour créer la fiche de produit dans le panier
    for (i = 0; i < getLocalStorage.length; i++) {
      // Création d'un array depuis le Local Storage
      products.push(getLocalStorage[i].id);
      // Affiche les produits dans la page panier selon nombre de produit existe dans le Local Storage
      cartItems.innerHTML +=
      `<article class="cart__item" data-id="${getLocalStorage[i].id}" data-color="${getLocalStorage[i].color}">
        <div class="cart__item__img">
          <img src="${getLocalStorage[i].image}" alt="${getLocalStorage[i].altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${getLocalStorage[i].name}</h2>
            <p>${getLocalStorage[i].color}</p>
            <p>${getLocalStorage[i].price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${getLocalStorage[i].quantitys}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
    }
  }

// Calcul total des quantités et les prix dans le panier Total
const totalQuantityAndPrice = () => {
  // Calcul total des quantités
  let itemQuantitys = document.getElementsByClassName("itemQuantity");
  let totalQuantity = 0;
  // Boucle for pour calculer les quantités total ajoutés
  for (let i = 0; i < itemQuantitys.length; ++i) {
      totalQuantity += parseInt(itemQuantitys[i].value);
  }
  // Affichage total quantités ajoutés dans la page panier Total
  let productTotalQuantity = document.getElementById("totalQuantity");
  productTotalQuantity.innerHTML = totalQuantity;

  // Calcul total des prix
  let totalPrice = 0;
  // Boucle for pour calculer les prix total avec les quantités ajoutés dans le Local Storage
  for (let i = 0; i < itemQuantitys.length; ++i) {
      totalPrice += (parseInt(itemQuantitys[i].value)* getLocalStorage[i].price);
  }
  // Affiche total des prix dans la page panier Total
  let productTotalPrice = document.getElementById("totalPrice");
  productTotalPrice.innerHTML = totalPrice;
}
totalQuantityAndPrice();

// Modification quantité dans le panier
const quantityModification = () => {
  let itemQuantity = document.querySelectorAll(".itemQuantity");
  // Boucle for pour écouter changement de quantité d'utilisateur
  for (let i = 0; i < itemQuantity.length; i++) {
    itemQuantity[i].addEventListener("change", () => {
    let newQuantity = parseInt(itemQuantity[i].value);
    // Variable element.closest()
    let newCart = itemQuantity[i].closest(".cart__item");
    // Récupèration dans le Local Storage les produits avec même id et couleur dans les quels on modifie la quantité 
    let newQty = getLocalStorage.find( element => element.id === newCart.dataset.id && element.color === newCart.dataset.color );
    // Exécute si la nouvelle quantité sont > 0 et < 100
    if (newQuantity > 0 && newQuantity <= 100 && parseInt(newQuantity)) {
      qty = parseInt(newQuantity);
      newQty.quantitys = qty;
      // On envoi la modification à Local Storage 
      localStorage.setItem("product", JSON.stringify(getLocalStorage));
      alert("Votre panier est bien à jour.");
      location.reload();
      // Message d'alerte si limitation quantité non réspecter
    } else if(newQuantity <= 0 || newQuantity > 100 || newQuantity !== null) {
        alert("⚠️ La quantité pour la même couleur est limitée à 100 quantités, Veuillez saisir un chiffre entre 1 à 100.");
        location.reload();
      }
    })
  }
}
quantityModification();

// Supprimer un produit
const deleteProduct = () => {
    const deleteItem = document.querySelectorAll(".deleteItem");
    // Boucle for pour écouter l'utilisateur sur le bouton supprimer
    for (let i = 0; i < deleteItem.length; i++) {
      deleteItem[i].addEventListener("click", () => {
      // Variable element.closest()
      let del = deleteItem[i].closest(".cart__item");
      // Filtrer les produits dans le Local Storage avec id et couleur
      getLocalStorage = getLocalStorage.filter( element => element.id !== del.dataset.id || element.color !== del.dataset.color);
      //console.log(getLocalStorage);
      // On mets à jour le Local Storage
      localStorage.setItem("product", JSON.stringify(getLocalStorage));
      // Suppression array produit si le panier est vide
      if (getLocalStorage.length === 0) {
        localStorage.removeItem("product");
      }// Message d'alerte pour un produit supprimé
      alert("Votre produit selectionné est bien supprimé.");
      location.reload();
      });
    }
}
deleteProduct();

// Formulaire
// Si panier est vide, la fonction formulaire ne fonctionnera pas
if(getLocalStorage === null || getLocalStorage === 0) {
} else {// Exécutera fonction formulaire si y a un produit dans le panier 
const form = () => {
  orderButton.addEventListener("click", () => {
// Les variables pour la formulaire
const firstName = document.getElementById("firstName").value;
const lastName = document.getElementById("lastName").value;
const address = document.getElementById("address").value;
const city = document.getElementById("city").value;
const email = document.getElementById("email").value;

// Variable pour fetch méthode POST
let order = {
  products,
  contact: {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  }
}

// Fonction pour vérifier le prénom
const checkFirstName = () => {
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  // Affiche alerte si le prénom saisis incorrecte
  if(/^[a-z ,.'-]+$/gmi.test(firstName) === false) {
    firstNameErrorMsg.innerHTML = `<p style="color:#FAE03C">⚠️ Prénom incorrect, Merci de saisir un prénom correct.</p>`;
  } else {// Pas d'alerte si le prénom saisis correctement
      firstNameErrorMsg.innerHTML = "";
      return true;
    }
}

// Fonction pour vérifier le nom
const checkLastName = () => {
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  // Affiche alerte si le nom saisis incorrecte
  if(/^[a-z ,.'-]+$/gmi.test(lastName) === false) {
    lastNameErrorMsg.innerHTML= `<p style="color:#FAE03C">⚠️ Nom incorrect, Merci de saisir un nom correct.</p>`;
  } else {// Pas d'alerte si le nom saisis correctement
      lastNameErrorMsg.innerHTML = "";
      return true;
    }
}

// Fonction pour vérifier l'adresse
const checkAddress = () => {
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  // Affiche alerte si l'adresse saisis incorrecte
  if(/^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/gm.test(address) === false) {
    addressErrorMsg.innerHTML = `<p style="color:#FAE03C">⚠️ Adresse incorrect, Merci de saisir une adresse correcte.</p>`;
  } else {// Pas d'alerte si l'adresse saisis correctement
      addressErrorMsg.innerHTML = "";
      return true;
    }
}

// Fonction pour vérifier la ville
const checkCity = () => {
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  // Affiche alerte si la ville saisis incorrecte
  if(/^[a-z ,.'-]+$/gmi.test(city) === false) {
    cityErrorMsg.innerHTML = `<p style="color:#FAE03C">⚠️ Nom de ville incorrect, Merci de saisir un nom de ville correcte.</p>`;
  } else {// Pas d'alerte si la ville saisis correctement
      cityErrorMsg.innerHTML = "";
      return true;
    }
}

// Fonction pour vérifier l'adresse email
const checkEmail = () => {
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  // Affiche alerte si l'email saisis incorrectement
  if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gm.test(email) === false) {
    emailErrorMsg.innerHTML = `<p style="color:#FAE03C">⚠️ Email incorrect, Merci de saisir une adresse email correct.</p>`;
  } else {// Pas d'alerte si l'email saisis correctement
      emailErrorMsg.innerHTML = "";
      return true;
    }
}

// On envoi l'objet contact dans le Local Storage si les vérification sont vrai
const checkValidationForm = () => {
  if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()) {
    localStorage.setItem("contact", JSON.stringify(order.contact));
    return true;
  } else {
    alert("Merci de compléter tout les champs de la formulaire avant de passer la commande.")
  }
}

// Fetch méthode Post pour envoyer data contact et Id produit
fetch("https://comfy-pony-4d1729.netlify.app/api/products/order", {
  method: "POST",
  body: JSON.stringify(order),
  headers: {
    "Accept": "application/json",
    "Content-type" : "application/json"
  }
})
  .then((res) => res.json())
  .then(d => {
  // On envoie numéro de commande si les vérifications formulaire sont vrai
  if (checkValidationForm()) {
    localStorage.setItem("orderId", d.orderId);
    // On dirige vers la page de confirmation le numéro de commande
    document.location.href = "confirmation.html?id=" + d.orderId;
  }
})
  // En cas d'erreur de récupération
  .catch(error => alert(error));
})
}
form();
}
})
// En cas d'erreur de récupération
.catch((error) => alert(error));