// Récupération Data API Produits
fetch("http://localhost:3000/api/products")
// Récupération du résultat de la requête au format json (Promise)
  .then((res) => res.json())
  // On retourne et récupère la vraie valeur du résultat json précédent (Promise)
  .then ((products) => {
    // console.log(products)
    // Boucle for pour créer la fiche de tout les produits
    for (i = 0; i < products.length; i++) {
      // innerHTML affiche tout les produits
      document.getElementById("items").innerHTML +=
      `<a href="./product.html?id=${products[i]._id}">
        <article>
          <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
          <h3 class="productName">${products[i].name}</h3>
          <p class="productDescription">${products[i].description}</p>
        </article>
      </a>`;
    }
  })
// En cas d'erreur de récupération Data API Produits
.catch(error => alert(error));