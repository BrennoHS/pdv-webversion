    // Função para atualizar o contador do carrinho
    window.updateCartCount = function (count) {
        $('.badge-notify').text(count);
    };



$(document).ready(function () {
    // array para armazenar itens do carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    window.updateCartCount(cart.length);

    // Carrega a página inicial por padrão
    $('#main-content').load('pages/home.html', function () {
        const modalElement = document.getElementById('addToCartModal');
        if (modalElement) {
            new bootstrap.Modal(modalElement);
        }
    });

    $('.nav-item').click(function (e) {
        e.preventDefault();

        $('.nav-item').removeClass('active');
        $(this).addClass('active');

        var page = $(this).attr('href').substring(1);
        $('#main-content').load('pages/' + page + '.html', function () {
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

    $(document).on('click', '.add-to-cart-btn', function () {
        const itemName = $(this).data('name');
        const itemPrice = parseFloat($(this).data('price'));
        $('#addToCartModalLabel').text(itemName); // Update modal title
        $('#addToCartModal').data('name', itemName).data('price', itemPrice); // Store for adding to cart
        $('#addToCartModal').modal('show');
    });

    $(document).on('click', '.add-to-cart-btn', function () {
        const itemName = $(this).data('name');
        const itemPrice = parseFloat($(this).data('price'));
        $('#addToCartModalLabel').text(itemName);
        $('#addToCartModal').data('name', itemName).data('price', itemPrice);
        $('#addToCartModal').modal('show');
    });

    // Adicionar item ao carrinho
    $(document).on('click', '#addToCartBtn', function () {
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
    window.renderCart = function () {
        const cartItemsContainer = $('#cartItems');
        cartItemsContainer.empty();
        const aviso = $('#carrinho-aviso');
        if (cart.length === 0) {
            aviso.show();
            // Esconde valor total e cuponss quando vazio
            $('.mt-3').hide(); // Esconde campo de cupom
            $('.btn-dark.w-100.mt-3').hide(); // Hide Finalizar Pedido button
            $('h2').hide();
        } else {
            aviso.hide();
            $('.mt-3').show();
            $('.btn-dark.w-100.mt-3').show();
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
        }
    };
    // Eventos para aumentar/diminuir quantidade
    $(document).on('click', '.increase-quantity', function () {
        const index = $(this).data('index');
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount(cart.length);
    });

    $(document).on('click', '.decrease-quantity', function () {
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
    window.updateCartCount = function (count) {
        $('.badge-notify').text(count);
    };
});

// Handle profile page load
function loadProfilePage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (user && loggedIn) {
        $('#auth-form').hide();
        $('#user-info').show();
        $('#user-name').text(user.name);
        $('#user-phone').text(user.phone);
        $('#user-address').text(user.address);
    } else {
        $('#auth-form').show();
        $('#user-info').hide();
    }
}

// Load profile page when navigating to it
if ($('#main-content').find('#profile-form').length) {
    loadProfilePage();
}
$(document).on('click', '.nav-item[href="#perfil"]', function () {
    $('#main-content').load('pages/perfil.html', function () {
        loadProfilePage();
    });
});

// Handle profile form submission
$(document).on('submit', '#profile-form', function (e) {
    e.preventDefault();
    const name = $('#name').val().trim();
    const phone = $('#phone').val().trim();
    const address = $('#address').val().trim();
    const password = $('#password').val();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        // Login attempt
        if (storedUser.password === password) {
            localStorage.setItem('loggedIn', 'true');
            $('#auth-message').text('Login bem-sucedido!').css('color', 'green');
            // Redirect to home page
            $('#main-content').load('pages/home.html', function () {
                const modalElement = document.getElementById('addToCartModal');
                if (modalElement) {
                    new bootstrap.Modal(modalElement);
                }
                $('.nav-item').removeClass('active');
                $('.nav-item[href="#home"]').addClass('active');
            });
        } else {
            $('#auth-message').text('Senha incorreta.').css('color', 'red');
        }
    } else {
        // Register new user
        const user = { name, phone, address, password };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loggedIn', 'true');
        $('#auth-message').text('Usuário registrado!').css('color', 'green');
        // Redirect to home page
        $('#main-content').load('pages/home.html', function () {
            const modalElement = document.getElementById('addToCartModal');
            if (modalElement) {
                new bootstrap.Modal(modalElement);
            }
            $('.nav-item').removeClass('active');
            $('.nav-item[href="#home"]').addClass('active');
        });
    }
});

// Logout Button
$(document).on('click', '#logout-btn', function () {
    localStorage.setItem('loggedIn', 'false');
    $('#auth-message').text('Você saiu da conta.').css('color', 'blue');
    $('#profile-form')[0].reset();
    loadProfilePage();
});

