import API from "./api";

API.get("/users")
    .then(res => console.log("Connected!", res.data))
    .catch(err => console.log("Error:", err));
