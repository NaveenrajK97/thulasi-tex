const API = "http://thulasi-backend-env.eba-srtkzmvv.ap-south-1.elasticbeanstalk.com";

async function loadProducts() {
  const res = await fetch(API + "/products");
  const data = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button>Add to Cart</button>
      </div>
    `;
  });
}

loadProducts();