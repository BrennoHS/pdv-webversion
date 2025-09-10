$(document).ready(function() {
    // Carrega a página inicial por padrão
    $('#main-content').load('pages/home.html', function() {
    const modalElement = document.getElementById('addToCartModal');
    if (modalElement) {
        new bootstrap.Modal(modalElement);
    }
});

    $('.nav-item').click(function(e) {
        e.preventDefault();
        
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        
        var page = $(this).attr('href').substring(1);
        $('#main-content').load('pages/' + page + '.html');
    });

    // Função para atualizar o contador do carrinho (exemplo)
    window.updateCartCount = function(count) {
        $('.badge-notify').text(count);
    };
});



$(document).ready(function() {
    // array para armazenar itens do carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    window.updateCartCount(cart.length);

    // Carrega a página inicial por padrão
$('#main-content').load('pages/home.html', function() {
    const modalElement = document.getElementById('addToCartModal');
    if (modalElement) {
        new bootstrap.Modal(modalElement);
    }
});

    $('.nav-item').click(function(e) {
        e.preventDefault();
        
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        
        var page = $(this).attr('href').substring(1);
        $('#main-content').load('pages/' + page + '.html', function() {
    if (page === 'carrinho') {
        renderCart();
    } else if (page === 'home') {
        const modalElement = document.getElementById('addToCartModal');
        if (modalElement) {
            new bootstrap.Modal(modalElement);
        }
    }
});
    });

$(document).on('click', '.add-to-cart-btn', function() {
    const itemName = $(this).data('name');
    const itemPrice = parseFloat($(this).data('price'));
    $('#addToCartModalLabel').text(itemName); // Update modal title
    $('#addToCartModal').data('name', itemName).data('price', itemPrice); // Store for adding to cart
    $('#addToCartModal').modal('show');
});

$(document).on('click', '.add-to-cart-btn', function() {
    const itemName = $(this).data('name');
    const itemPrice = parseFloat($(this).data('price'));
    $('#addToCartModalLabel').text(itemName);
    $('#addToCartModal').data('name', itemName).data('price', itemPrice);
    $('#addToCartModal').modal('show');
});

    // Adicionar item ao carrinho
   $(document).on('click', '#addToCartBtn', function() {
    const item = {
        name: $('#addToCartModal').data('name'),
        basePrice: $('#addToCartModal').data('price'),
        extras: [],
        observations: $('#observations').val().trim() || '',
        quantity: 1
    };
    if ($('#extraBacon').is(':checked')) {
        item.extras.push({ name: 'Bacon', price: 3.00 });
    }
    if ($('#extraCheddar').is(':checked')) {
        item.extras.push({ name: 'Cheddar', price: 2.00 });
    }
    const existingItemIndex = cart.findIndex(cartItem =>
        cartItem.name === item.name &&
        JSON.stringify(cartItem.extras) === JSON.stringify(item.extras) &&
        cartItem.observations === item.observations
    );
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(item);
    }
    window.updateCartCount(cart.length);
    localStorage.setItem('cart', JSON.stringify(cart));
    $('#addToCartModal').modal('hide');
    $('#addToCartForm')[0].reset();
});

    // funcao para renderizar items no carrinho.html
    window.renderCart = function() {
    const cartItemsContainer = $('#cartItems');
    cartItemsContainer.empty();
    let subtotal = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.basePrice + item.extras.reduce((sum, extra) => sum + extra.price, 0);
        subtotal += itemTotal * item.quantity;
        const extrasText = item.extras.length > 0 ? `Adicionais: ${item.extras.map(e => e.name).join(', ')}` : '';
        const observationsText = item.observations ? `Observações: ${item.observations}` : '';
        const itemHtml = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${extrasText}</p>
                    <p class="card-text">${observationsText}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="card-text">R$ ${(itemTotal * item.quantity).toFixed(2)}</p>
                        <div>
                            <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.append(itemHtml);
    });
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;
    $('#subtotal').text(`R$ ${subtotal.toFixed(2)}`);
    $('#deliveryFee').text(`R$ ${deliveryFee.toFixed(2)}`);
    $('#total').text(`R$ ${total.toFixed(2)}`);
};

    // Eventos para aumentar/diminuir quantidade
    $(document).on('click', '.increase-quantity', function() {
        const index = $(this).data('index');
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount(cart.length);
    });

    $(document).on('click', '.decrease-quantity', function() {
        const index = $(this).data('index');
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1); // remove item se quantidade for 0
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount(cart.length);
    });

    // funcao para atualizar o contador do carrinho
    window.updateCartCount = function(count) {
        $('.badge-notify').text(count);
    };
});

    // funcao para mostrar que carrinho esta vazio
