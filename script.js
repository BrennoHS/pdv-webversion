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