document.addEventListener('DOMContentLoaded', function () {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    loadHeader(currentPage);
    loadFooter();
});

function loadHeader(activePage) {
    var header = document.querySelector('header');
    var pages = [
        { href: 'index.html', label: 'Home' },
        { href: 'students.html', label: 'Students' },
        { href: 'research.html', label: 'Research' },
        { href: 'teaching.html', label: 'Teaching' },
        { href: 'pluviometro.html', label: 'Pluviômetro' },
        { href: 'miscellaneous.html', label: 'Miscellaneous' }
    ];

    var navItems = pages.map(function (p) {
        var activeClass = p.href === activePage ? ' active' : '';
        return '<li class="nav-item">' +
            '<a class="nav-link' + activeClass + '" href="' + p.href + '">' + p.label + '</a>' +
            '</li>';
    }).join('');

    header.innerHTML =
        '<div class="container">' +
            '<div class="row justify-content-center align-items-center g-2">' +
                '<div class="col-12 col-lg-6">' +
                    '<a href="https://www.dm.ufscar.br/dm/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none img-link">' +
                        '<img src="Assets/dm_logo.png" alt="Departamento de Matematica" width="80px" height="65px">' +
                    '</a>' +
                '</div>' +
                '<div class="col-12 col-lg-6">' +
                    '<div class="navbar navbar-expand-lg bg-body-tertiary">' +
                        '<div class="container-fluid">' +
                            '<div class="navbar-toggler-wrapper">' +
                                '<button class="navbar-toggler navbar-toggler-custom" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">' +
                                    '<span class="navbar-toggler-icon"></span>' +
                                '</button>' +
                            '</div>' +
                            '<div class="collapse navbar-collapse" id="navbarNavDropdown">' +
                                '<ul class="navbar-nav">' +
                                    navItems +
                                    '<li class="nav-lattes">' +
                                        '<a href="https://lattes.cnpq.br/5890727692959507" class="img-link">' +
                                            '<img src="Assets/Lattes.png" alt="Currículo Lattes" width="60px" height="45px">' +
                                        '</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
}

function loadFooter() {
    var footer = document.querySelector('footer');
    footer.innerHTML =
        '<div class="container">' +
            '<div class="row">' +
                '<div class="col-lg-2"></div>' +
                '<div class="col-lg-8">' +
                    '<p class="footer-info">' +
                        'Departamento de Matem\u00e1tica, Universidade Federal de S\u00e3o Carlos, 13565-905 S\u00e3o Carlos, S\u00e3o Paulo, Brazil' +
                        '<br>' +
                        '<a href="mailto:franciscobraun@dm.ufscar.br">franciscobraun@dm.ufscar.br</a>' +
                        '<br>' +
                        'Tel: +55 16 33519183' +
                        '<br>' +
                        'Room: 234 (DM)' +
                    '</p>' +
                '</div>' +
                '<div class="col-lg-2">' +
                    '<a class="img-link" href="https://www.ufscar.br">' +
                        '<img class="footer-logo rounded mx-auto d-block" src="Assets/Ufscar.gif" alt="UFSCar" width="80" height="65">' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>';
}
