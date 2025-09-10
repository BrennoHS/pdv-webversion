$(document).ready(function() {
    // Carrega a página inicial por padrão
    $('#main-content').load('pages/home.html');

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
    let cart = [];

    // Carrega a página inicial por padrão
    $('#main-content').load('pages/home.html');

    $('.nav-item').click(function(e) {
        e.preventDefault();
        
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        
        var page = $(this).attr('href').substring(1);
        $('#main-content').load('pages/' + page + '.html', function() {
            // If loading cart page, render cart items
            if (page === 'carrinho') {
                renderCart();
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

    // Adicionar item ao carrinho
    $(document).on('click', '#addToCartBtn', function() {
        const item = {
    name: $('#addToCartModal').data('name'),
    basePrice: $('#addToCartModal').data('price'),
    extras: [],
    observations: $('#observations').val() || '',
    quantity: 1
};

        // condicional que verifica os adicionais selecionados
        if ($('#extraBacon').is(':checked')) {
            item.extras.push({ name: 'Bacon', price: 3.00 });
        }
        if ($('#extraCheddar').is(':checked')) {
            item.extras.push({ name: 'Cheddar', price: 2.00 });
        }

        // adiciona item no carrinho
        cart.push(item);
        updateCartCount(cart.length);

        // fecha modal
        $('#addToCartModal').modal('hide');

        // reseta formulario
        $('#addToCartForm')[0].reset();
    });

    // funcao para renderizar items no carrinho.html
    window.renderCart = function() {
    const cartItemsContainer = $('#cartItems');
    cartItemsContainer.empty(); // Clear existing items

    // Mostra ou esconde aviso conforme o carrinho
    if (cart.length === 0) {
        $('#carrinho-aviso').show();
    } else {
        $('#carrinho-aviso').hide();
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.basePrice + item.extras.reduce((sum, extra) => sum + extra.price, 0);
        subtotal += itemTotal * item.quantity;

        const extrasText = item.extras.length > 0 ? `Adicionais: ${item.extras.map(e => e.name).join(', ')}` : '';
        const itemHtml = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${extrasText}</p>
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

        // atualiza totais
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
        renderCart();
        updateCartCount(cart.length);
    });

    // funcao para atualizar o contador do carrinho
    window.updateCartCount = function(count) {
        $('.badge-notify').text(count);
    };
});

    // funcao para mostrar que carrinho esta vazio
