$(".btn-login").on("click", function () {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;

    if (email.trim() === '' || password.trim() === '') {
        alert('Please enter email and password');
        return;
    };
    fetch('https://dummyjson.com/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: email,
            password: password,
        }),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Email or password is incorrect. Try again!");
            }
            return res.json(); // trả promise để then tiếp
        })
        .then(data => {
            localStorage.setItem('account', JSON.stringify(data));
            alert("Đăng nhập thành công");
            window.location.href = "index.html";
        })
        .catch(error => {
            alert("Error:", error.message);
        });
});