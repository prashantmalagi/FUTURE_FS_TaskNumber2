const LOGIN_API = "https://mini-crm-9ntd.onrender.com/api/auth/login";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        alert("Login failed");
    }
});
