const baseUrl = "https://fakestoreapi.com";

const getProducts = async (url, id = "") => {
    try {
        const res = await fetch(`${baseUrl}/${url}${id ? `/${id}` : ""}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const tab_content = document.querySelector(".tab_content");
const tab_btn = document.querySelectorAll(".tab_btn");

let localData = JSON.parse(localStorage.getItem("products")) || [];

const renderCategory = async (category) => {
    const data = await getProducts(category);

    tab_content.innerHTML = data.map((item) => `
        <div class="nike_card">
            <div class="nike_card_img">
                <img class="nike_card_img_" src="${item.image}" alt="img" />
                <div class="nike_card_hover_btns">
                    <button class="nike_card_like_btn" data-el="${item.id}"></button>
                    <button class="nike_card_buy_btn" data-buy="${item.id}"></button>
                </div>
            </div>
            <h3 class="nike_card_title">${item.title}</h3>
            <p class="nike_card_pice">${item.price} UZS</p>
            <p class="nike_card_des">${item.description}</p>
            <p class="nike_card_category">CATEGORY: ${item.category}</p>
            <p class="nike_card_rate">RAITING: ${item.rating?.rate}</p>
            <p class="nike_card_count">COUNT: ${item.rating?.count}</p>
        </div>
    `).join("");

    const cards = document.querySelectorAll(".nike_card_img");
    cards.forEach(card => {
        const btns = card.querySelector(".nike_card_hover_btns");
        card.addEventListener("mouseover", () => btns.classList.add("nike_card_hover_btns_active"));
        card.addEventListener("mouseout", () => btns.classList.remove("nike_card_hover_btns_active"));
    });
};

tab_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.tab;
        tab_btn.forEach((b) => b.classList.remove("tab_btn_active"));
        btn.classList.add("tab_btn_active");
        renderCategory(category === "products" ? "products" : `products/category/${category}`);
    });
});

renderCategory("products");

tab_content.addEventListener("click", async (e) => {
    if (e.target.dataset.el) {
        const res = await fetch(`${baseUrl}/products/${e.target.dataset.el}`);
        const data = await res.json();
        const exists = localData.find(el => el.id === data.id);
        if (!exists) {
            localData.push(data);
            localStorage.setItem("products", JSON.stringify(localData));
        } else {
            Toastify({
                text: "Bu mahsulot allaqachon saqlangan!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#FF5252",
                close: true,
                stopOnFocus: true
            }).showToast();
        }
    }

    if (e.target.dataset.buy) {
        let cardData = JSON.parse(localStorage.getItem("cart")) || [];
        const res = await fetch(`${baseUrl}/products/${e.target.dataset.buy}`);
        const data = await res.json();
        const exists = cardData.find(el => el.id === data.id);
        if (!exists) {
            data.count = 1;
            cardData.push(data);
            localStorage.setItem("cart", JSON.stringify(cardData));
        }
    }
});

// Like modal
const top_header_like_btn = document.querySelector(".top_header_like_btn");
const heart_modal = document.querySelector(".heart_modal");
const heart_modal_content = document.querySelector(".heart_modal_content");

top_header_like_btn.addEventListener("click", () => {
    heart_modal.classList.add("heart_modal_active");

    heart_modal_content.innerHTML = localData.map(item => `
        <div class="heart_modal_item">
            <div class="heart_modal_item_img">
                <img src="${item.image}" alt="img" />
            </div>
            <div class="heart_modal_item_info">
                <p class="sale_card_title">${item.title}</p>
                <p class="sale_card_price">${item.price} UZS</p>
                <p class="sale_card_category">${item.category}</p>
            </div>
        </div>
    `).join("");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("heart_modal_exit_btn");
    closeBtn.textContent = "X";
    heart_modal_content.prepend(closeBtn);

    closeBtn.addEventListener("click", () => {
        heart_modal.classList.remove("heart_modal_active");
    });
});

// Buy modal
const top_header_buy_btn = document.querySelector(".top_header_buy_btn");
const buy_modal = document.querySelector(".buy_modal");
const buy_modal_content = document.querySelector(".buy_modal_content");

top_header_buy_btn.addEventListener("click", () => {
    renderBuyModal();
});

function renderBuyModal() {
    const cardData = JSON.parse(localStorage.getItem("cart")) || [];
    buy_modal.classList.add("buy_modal_active");

    buy_modal_content.innerHTML = cardData.map(item => `
        <div class="heart_modal_item">
            <div class="heart_modal_item_img">
                <img src="${item.image}" alt="img" />
            </div>
            <div class="heart_modal_item_info">
                <p class="sale_card_title">${item.title}</p>
                <p class="sale_card_price">${(item.price * (item.count || 1)).toFixed(2)} UZS</p>
                <p class="sale_card_category">${item.category}</p>
                <p class="sale_card_count">COUNT: ${item.count || 1}</p>
            </div>
            <button data-type="decrement" data-id="${item.id}" class="buttonss">-</button>
            <button data-type="increment" data-id="${item.id}" class="buttonss">+</button>
        </div>
    `).join("");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("buy_modal_exit_btn");
    closeBtn.textContent = "X";
    buy_modal_content.prepend(closeBtn);

    closeBtn.addEventListener("click", () => {
        buy_modal.classList.remove("buy_modal_active");
    });
}

// +-
buy_modal_content.addEventListener("click", (e) => {
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];
    const id = +e.target.dataset.id;
    const item = cartData.find(el => el.id === id);
    const action = e.target.dataset.type;

    if (action === "increment") {
        if (item) {
            item.count = (item.count || 1) + 1;
            localStorage.setItem("cart", JSON.stringify(cartData));
            renderBuyModal();
        }
    }

    if (action === "decrement") {
        if (item && item.count > 1) {
            item.count -= 1;
        } else if (item && item.count === 1) {
            cartData = cartData.filter(el => el.id !== id);
        }
        localStorage.setItem("cart", JSON.stringify(cartData));
        renderBuyModal();
    }
});


// slider

$('.slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1
});
