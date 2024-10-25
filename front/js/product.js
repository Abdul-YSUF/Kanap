// Les variables
const image = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const addToCart = document.getElementById("addToCart");

// Récupération produit par l'Id
const productId = new URLSearchParams(location.search).get("id");
// console.log(productId)
fetch("https://comfy-pony-4d1729.netlify.app/api/products/" + productId)
    // Récupération du résultat de la requête au format json (Promise)
    .then((res) => res.json())
    // On retourne et récupère la vraie valeur du résultat json précédent (Promise)
    .then((product) => {
        // On affiche la balise title avec le nom du produit sélectionné
        document.title = product.name;
        // innerHTML affichage chaque produit dans la page product (cliqué depuis la page d'accueil)
        image.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        title.innerHTML += `${product.name}`;
        price.innerHTML += `${product.price} `;
        description.innerHTML += `${product.description}`;
        // Boucle for pour le choix des couleurs
        for (i = 0; i < product.colors.length; i++) {
            colors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
        }
    })
// En cas d'erreur de récupération
.catch((error) => alert(error));

// Création Event Listener pour ajouter le(s) produit(s) dans le panier en appuyant sur le bouton "Ajouter au panier"
addToCart.addEventListener("click", () => {

  colorSelected = colors.value;
  quantitySelected = parseInt(quantity.value);

// Exécution codes si la quantité sélectionner est supérieur à 0 et inférieur 100
if (colorSelected !== "" && quantitySelected > 0 && quantitySelected <= 100 && parseInt(quantitySelected)) {
  // Variable pour stocker id, couleur et quantité dans le Local Storage
    const cart = {
        id: productId,
        color: colorSelected,
        quantitys: quantitySelected,
    }

    let updateLocalStorage = false;
    // Fonction pour ajouter les produits en fonction de produit existe ou non dans le Local Storage
    const addProductToLocalStorage = () => {
           
        let findProduct = productInLocalStorage.find((item) => item.id === cart.id && item.color === cart.color);
        // Si le produit de même couleur existe, on vérifie si le produit est bien inférieur 100 quantités ou non
        if(findProduct) {
            const qty = parseInt(findProduct.quantitys) + parseInt(cart.quantitys);
            if(qty <= 100) {// Vérification si le produit est inférieur 100 quantités
                updateLocalStorage = false;
                findProduct.quantitys = qty;
                alert("Votre panier est bien mis à jour.");
            } else {// Alerte si la quantité supplémentaire dépasse 100 quantités
                updateLocalStorage = false;
                let balanceQuantity = 100-(qty - cart.quantitys)// Affiche la quantité restant
                alert("⚠️ La quantité d'un produit de la même couleur est limité à 100 quantités, Vous pouvez encore ajouter: " + balanceQuantity + " quantité(s).");
            }
        } else {// Si le produit et la couleur n'existent pas encore dans le Local Storage
          updateLocalStorage = true;
          productInLocalStorage.push(cart);
        }
        // On envoi à Local Storage
        localStorage.setItem("product", JSON.stringify(productInLocalStorage))
    }

    // Vérification si Local Storage est vide ou non
    let productInLocalStorage = JSON.parse(localStorage.getItem("product"));

        if(productInLocalStorage) { // Ajouter la quantité supplémentaire uniquement
            addProductToLocalStorage();
        } else { // Si le Local Storage est vide, on crée un array et on ajoute
            productInLocalStorage = [];
            addProductToLocalStorage();
            updateLocalStorage = false; // Alerte si on ajoute nouveau produit pour la premiere fois
                alert("Vous venez d'ajouté votre premier produit dans le panier 👏");
        }
    if(updateLocalStorage) { // Alerte si déja un produit existe dans le Local Storage et on ajoute un nouveau produit et/ou la couleur
        alert("Votre produit a été bien ajouté dans le panier.");
    }

} else { // Vérification couleur et la quantité sont bien choisis ou non
    if (colorSelected == false) {// Alerte si la couleur d'un produit non sélectionné
        alert("⚠️ Choisissez une couleur");
        }
    // Alerte si la quantité d'un produit non sélectionné
    else if (quantitySelected <= 0 || quantitySelected > 100 || quantitySelected != null) {
        alert("⚠️ Sélectionner la quantité entre 1 à 100");
    }
}
});