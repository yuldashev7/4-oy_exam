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

const heart_modal_content = document.querySelector(".heart_modal_content");

let localData = JSON.parse(localStorage.getItem("products")) || [];



const renderCategory = async (category) => {
    const data = await getProducts(category);

    tab_content.innerHTML = data.map((item) => `
        <div class="nike_card">
           <div class="nike_card_img">
             <img class="nike_card_img_" src="${item.image}" alt="img" />
                 <div class="nike_card_hover_btns">
                    <button class="nike_card_like_btn" data-el="${item.id}"></button>
                    <button class="nike_card_buy_btn"></button>
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

    // hover_card

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
        btn.classList.add("tab_btn_active")
        renderCategory(category === "products" ? "products" : `products/category/${category}`);
    });
});

renderCategory("products")

// local
// function renderLike() {
//     const likeItems = JSON.parse(localStorage.getItem("products")) || [];;

//     heart_modal_content.innerHTML = likeItems.map(item => `
//          <div class="heart_item">
//             <img src="${item.image}" alt="img"/>
//             <p>${item.title}</p>  
//             <p>${item.price} UZS</p>
//         </div>
//         `).join("");
// };


// tab_content.addEventListener("click", async (e) => {
//     if (e.target.dataset.el) {
//         const res = await fetch(`${baseUrl}/products/${e.target.dataset.el}`);
//         const data = await res.json();
//         const exists = localData.find(el => el.id === data.id);
//         if (!exists) {
//             localData.push(data);
//             localStorage.setItem("products", JSON.stringify(localData));
//             renderLike();
//         } else {
//             alert("Bu mahsulot allaqachon saqlangan!");
//         }

//     }
//     console.log(e.target.dataset.el);
// });

// tab_content.addEventListener("click")



// heart modal

const top_header_like_btn = document.querySelector(".top_header_like_btn");
const heart_modal = document.querySelector(".heart_modal");
const heart_modal_exit_btn = document.querySelector(".heart_modal_exit_btn");

top_header_like_btn.addEventListener("click", () => {
    heart_modal.classList.add("heart_modal_active");
    heart_modal_exit_btn.addEventListener("click", () => {
        // renderLike()
        heart_modal.classList.remove("heart_modal_active")
    });
});