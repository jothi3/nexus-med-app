let cart = [];
let user = null;
let currentShop = "";

const allMeds = [
  {name:"Dolo 650", price:42, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Crocin Advance", price:38, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Azithral 500", price:118, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Liv-52 Syrup", price:165, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Neurobion Forte", price:35, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Saridon", price:45, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Revital H", price:299, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Calpol 650", price:40, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Combiflam", price:65, img:"https://i.imgur.com/0L9aP8k.png"},
  {name:"Vicks VapoRub", price:89, img:"https://i.imgur.com/0L9aP8k.png"}
];

const nearbyShops = ["Apollo Pharmacy","MedPlus","Guardian","Netmeds Store","1mg Pharmacy","Pharmeasy","Wellness Forever","TrueMeds","Reliance Medico","Healthkart"];

// LIVE GPS LOCATION
function getLiveLocation() {
  const el = document.getElementById("userLocation");
  if (!el) return;

  if (!navigator.geolocation) { el.innerHTML = "<i class='fas fa-location-crosshairs'></i> Location not supported"; return; }

  el.innerHTML = "<i class='fas fa-location-crosshairs'></i> Detecting location...";

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
      const data = await res.json();
      const city = (data.address.city || data.address.town || data.address.state_district || "Your Area").replace(" Municipal Corporation","");
      const time = {Mumbai:"18–35 min",Delhi:"20–40 min",Bangalore:"22–45 min",Hyderabad:"25–50 min",Chennai:"20–40 min"}[city] || "25–55 min";
      el.innerHTML = `<i class="fas fa-location-crosshairs"></i> ${city} • ${time}`;
    },
    () => el.innerHTML = "<i class='fas fa-location-crosshairs'></i> Location blocked • 30–60 min",
    {timeout:10000, enableHighAccuracy:true}
  );
}

// GOOGLE PAY / UPI PAYMENT
function payWithUPI() {
  if (cart.length === 0) { alert("Cart is empty!"); return; }
  const total = cart.reduce((a,b)=>a+b.price,0);
  const yourUPI = "yourname@oksbi"; 

  const link = `upi://pay?pa=${yourUPI}&pn=NEXUS%20MED&am=${total}&cu=INR&tn=Order%20${Date.now()}`;
  window.location.href = link;

  setTimeout(() => {
    if (confirm("Payment Done?")) {
      alert("Order Placed! Delivery in 30 mins");
      cart = []; updateCart(); toggleCart();
    }
  }, 3000);
}

// RAZORPAY PAYMENT
function payWithRazorpay() {
  if (cart.length === 0) return alert("Cart is empty!");

  fetch('/create_order', {method:'POST'})
    .then(r => r.json())
    .then(order => {
      var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", 
        "amount": order.amount,
        "currency": "INR",
        "name": "NEXUS MED",
        "description": "Medicine Order",
        "order_id": order.id,
        "handler": function (response){
          alert("Payment Successful! ID: " + response.razorpay_payment_id);
          location.href = "/success";
        },
        "prefill": { "name": "Customer", "contact": "9999999999" },
        "theme": { "color": "#ff0066" }
      };
      var rzp = new Razorpay(options);
      rzp.open();
    });
}

window.onload = () => {
  displayShops(nearbyShops);
  displayMedicines(allMeds);
  updateCart();
  getLiveLocation();

  document.getElementById("mainSearch").addEventListener("input", () => {
    const q = document.getElementById("mainSearch").value.toLowerCase().trim();
    const shops = nearbyShops.filter(s=>s.toLowerCase().includes(q));
    const meds = allMeds.filter(m=>m.name.toLowerCase().includes(q));
    displayShops(shops);
    displayMedicines(meds);
  });
};

function displayShops(list) {
  document.getElementById("allShops").innerHTML =
    list.map(s=>`<div class="shop-card" onclick="enterShop('${s}')">
      <div class="shop-header"><h3>${s}</h3><p>4.7 ★ • Open Now</p></div>
      <div style="padding:20px;text-align:center;"><button class="btn-cyber">Enter Store</button></div>
    </div>`).join('');
}

function displayMedicines(list) {
  const container = currentShop ? document.getElementById("shopProducts") : document.getElementById("productsGrid");
  container.innerHTML = list.map(m=>`
    <div class="product-card">
      <img src="${m.img}" alt="${m.name}">
      <h3>${m.name}</h3>
      <div class="price">₹${m.price}</div>
      <button class="btn-cyber" onclick="addToCart('${m.name}',${m.price})">Add to Cart</button>
    </div>`).join('');
}

function enterShop(name) {
  currentShop = name;
  document.getElementById("homeView").style.display="none";
  document.getElementById("shopView").style.display="block";
  document.getElementById("currentShopName").textContent = name;
  displayMedicines(allMeds);
}

function goBackHome() {
  currentShop = "";
  document.getElementById("homeView").style.display="block";
  document.getElementById("shopView").style.display="none";
}

function addToCart(name,price) {
  cart.push({name,price});
  updateCart();
  const b = event.target;
  b.innerHTML="Added!";
  b.style.background="#00ff88";
  setTimeout(()=>{b.innerHTML="Add to Cart"; b.style.background="";},1500);
}

function updateCart() {
  const total = cart.reduce((a,b)=>a+b.price,0);
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartItemsCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = total;

  document.getElementById("cartItems").innerHTML =
    cart.length===0
    ? '<p class="empty">Your cart is empty</p>'
    : cart.map((i,idx)=>`
      <div style="padding:15px 0;border-bottom:1px solid #444;display:flex;justify-content:space-between;align-items:center;">
        <div><strong style="color:#ff6bff;">${i.name}</strong><br><small style="color:#aaa;">₹${i.price}</small></div>
        <button onclick="cart.splice(${idx},1);updateCart()" style="background:none;border:none;color:#ff3366;font-size:26px;cursor:pointer;">×</button>
      </div>`).join('');
}

function toggleCart() { document.getElementById("cartSidebar").classList.toggle("open"); }
function openModal() { document.getElementById("authModal").style.display="flex"; }
function closeModal() { document.getElementById("authModal").style.display="none"; }
function openTab(e,t) {
  document.querySelectorAll(".tabcontent").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tablink").forEach(x=>x.classList.remove("active"));
  document.getElementById(t).classList.add("active");
  e.currentTarget.classList.add("active");
}

function login() { user={name:"User"}; afterLogin(); }
function signup() { user={name:document.getElementById("signupName").value.trim()||"User"}; afterLogin(); }

function afterLogin() {
  closeModal();
  document.getElementById("userName").textContent=`Hi, ${user.name.split(" ")[0]}!`;
  document.getElementById("userName").style.display="inline";
  document.getElementById("loginBtn").style.display="none";
}
