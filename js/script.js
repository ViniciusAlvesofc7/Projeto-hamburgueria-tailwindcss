const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCloseModal = document.getElementById('close-modal-btn');
const cartCheckoutModal = document.getElementById('checkout-btn');
const cartCounter = document.getElementById('cart-count');
const addresInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

// ABRIR MODAL DO CARRINHO
cartBtn.addEventListener('click', ()=>{
    updateCartModal();
    cartModal.style.display = 'flex'
})
// **** 

// FECHAR MODAL DO CARRINHO
cartModal.addEventListener('click', (event)=>{
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

cartCloseModal.addEventListener('click', ()=>{
    cartModal.style.display = 'none'
})
// ****

menu.addEventListener('click', (event)=>{
    let addCartBtn = event.target.closest(".add-to-cart-btn")

    if(addCartBtn){
        const name = addCartBtn.getAttribute("data-name");
        const price = Number(addCartBtn.getAttribute("data-price"));

        // ADICIONAR NO CARRINHO
        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // Se o item já existe, aumenta apenas a quantidade
        existingItem.quantity += 1;
        return;
    }else{
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal();
    
}

// ATUALIZA CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justif-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML =`
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="remove-cart-btn" data-name="${item.name}">Remover</button>
                </div>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// FUNÇAÕ PARA REMOVER O ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", (event)=>{
    if(event.target.classList.contains("remove-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index!== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addresInput.addEventListener("input", (event)=>{
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addresInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})


// FINALIZAR PEDIDO
cartCheckoutModal.addEventListener("click", ()=>{

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
           text: "Ops, O restaurante está fechado!",
           duration: 3000,
           close: true,
           gravity: "top",
           position: "right",
           stopOnFocus: true,
           Style: {
                backgorund: "#ef4444",
           },
        }).showToast();
        return;
    }

    if(cart.length === 0){
        return;
    }

    if(addresInput.value ===""){
        addressWarn.classList.remove("hidden");
        addresInput.classList.add("border-red-500");
        return;
    }

    // ENVIAR O PEDIDO PARA API DO WHATSAPP
    const cartItems = cart.map((item)=>{
        return (
            `${item.name}\nQuantidade: (${item.quantity})\nPreço: R$${item.price}`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems);
    const phone = "8196392245"

    window.open(`https://wa.me/${phone}?text=${message} Edereço: ${addresInput.value}`, "_blank") 

    cart.length = 0;
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
spanItem.classList.add("bg-green-600");
spanItem.classList.add("bg-green-600");
spanItem.classList.add("bg-green-600");

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}