// Affichage de numéro de commande
const orderId = document.getElementById("orderId");
orderId.innerHTML = localStorage.getItem("orderId");
localStorage.clear();