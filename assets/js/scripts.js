//Variable
var users = [];
var pageSize = 8;
var page = 1;
var searchKeyword = '';
var sortBy = 'firstName-asc';

window.onload = function () {
    fetch('https://dummyjson.com/users')
        .then(res => res.json())
        .then(data => {
            users = data.users;
            getUsers(users);
        });
}

//Load data từ API
function getUsers() {
    var temp = users;
    if (searchKeyword != '') {
        temp = temp.filter(u =>
            u.firstName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.company?.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.address?.country?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }
    switch (sortBy) {
        case "firstName-asc":
            temp = temp.sort((a, b) => a.firstName.localeCompare(b.firstName));
            break;
        case "firstName-desc":
            temp = temp.sort((a, b) => b.firstName.localeCompare(a.firstName));
            break;
        case "company-asc":
            temp = temp.sort((a, b) => a.company.name.localeCompare(b.company.name));
            break;
        case "company-desc":
            temp = temp.sort((a, b) => b.company.name.localeCompare(a.company.name));
            break;
        case "country-asc":
            temp = temp.sort((a, b) => a.address.country.localeCompare(b.address.country));
            break;
        case "country-desc":
            temp = temp.sort((a, b) => b.address.country.localeCompare(a.address.country));
            break;
    }
    paginationUser(temp);
    temp = temp.slice((page - 1) * pageSize, Math.min(users.length - 1, page * pageSize));
    displayUser(temp);
}

//Hiển thị danh sách user phù hợp
function displayUser(users) {
    document.getElementsByTagName("tbody")[0].innerHTML = '';
    users.forEach(user => {
        document.getElementsByTagName("tbody")[0].innerHTML +=
            `
            <tr>
                <td><img src="${user.image}" class="user-avatar"/></td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.company.name}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.address.country}</td>
                <td><span class="status ${(user.role === 'admin') ? 'active' : 'inactive'}">${(user.role === 'admin') ? 'Admin' : 'Staff'}</span></td>
            </tr>
            `;
    });
}

//Hiển thị phần phân trang
function paginationUser(users) {
    const paginationElement = document.getElementsByClassName("pagination")[0];
    paginationElement.innerHTML += `Showing data ${(page - 1) * pageSize + 1} to ${Math.min((page * pageSize), users.length)} of ${users.length} entries`;
    var totalPage = parseInt(Math.ceil(users.length / pageSize));
    $('#pagination').empty();
    console.log(page + ' / ' + totalPage);
    //Nếu không có user nào phù hợp sẽ đưa ra thôgn báo
    if (totalPage <= 0) {
        document.getElementsByClassName('pagination')[0].innerHTML +=
            `<h1 style="color: red">User list is empty!</h1>`;
        return;
    }
    let maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPage, page + 2);
    //Nếu có tồn tại trang trước đó sẽ hiện nút Previous
    if (page > 1) {
        $('#pagination').append(`<li class="page-item"><a class="page-link" href="#" data-page="${page - 1}"><</a></li>`);
    }
    //Hiện trang hiện tại và các trang lân cận
    for (let i = startPage; i <= endPage; i++) {
        let activeClass = i === page ? 'active' : '';
        $('#pagination').append(`<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }
    //Nếu có tồn tại trang sau đó sẽ hiện nút Next
    if (page < totalPage) {
        $('#pagination').append(`<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">></a></li>`);
    }
    //Thêm sự kiện cho nút 
    $('.page-link').on('click', function (e) {
        e.preventDefault();
        page = parseInt($(this).data('page'));
        getUsers();
    });
}

//Search user by keyword
$("#searchUser").on("input", function () {
    searchKeyword = document.getElementById('searchUser').value;
    page = 1;
    getUsers();
});

$("#sortOptions").on("change", function () {
    sortBy = document.getElementById('sortOptions').value;
    page = 1;
    getUsers();
});