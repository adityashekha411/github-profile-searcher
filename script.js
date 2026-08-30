const usernameInput = document.getElementById("usernameInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const profile = document.getElementById("profile");

async function searchGitHubUser() {
    const username = usernameInput.value.trim();

    if (!username) {
        message.textContent = "Please enter a GitHub username.";
        profile.innerHTML = "";
        return;
    }

   message.innerHTML = `
    <div class="loader"></div>
    <span>Searching GitHub...</span>
`;
    profile.innerHTML = "";

    try {
        // Fetch the user's profile
        const userResponse = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!userResponse.ok) {
            throw new Error("User not found");
        }

        const user = await userResponse.json();

        // Fetch the user's repositories
        const repoResponse = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        );

        const repos = await repoResponse.json();

        displayProfile(user, repos);

        message.textContent = "";
    } catch (error) {
        message.textContent = "User not found. Please check the username.";
        profile.innerHTML = "";
    }
}

function displayProfile(user, repos) {
    profile.innerHTML = `
        <div class="profile-card">

            <img
                src="${user.avatar_url}"
                alt="${user.login}'s profile picture"
                class="avatar"
            >

            <h2>${user.name || user.login}</h2>

            <p class="username">@${user.login}</p>

           <p class="bio">
    ${user.bio || "No bio available."}
</p>
<div class="profile-details">
    ${user.location ? `<span>📍 ${user.location}</span>` : ""}
    ${user.company ? `<span>🏢 ${user.company}</span>` : ""}
</div>

<a
    href="${user.html_url}"
    target="_blank"
    class="profile-button"
>
    View GitHub Profile
</a>

<div class="stats">
                <div>
                    <strong>${user.followers}</strong>
                    <span>Followers</span>
                </div>

                <div>
                    <strong>${user.following}</strong>
                    <span>Following</span>
                </div>

                <div>
                    <strong>${user.public_repos}</strong>
                    <span>Public Repos</span>
                </div>
            </div>

            <h3>Recent Repositories</h3>

            <div class="repositories">
                ${repos.map(repo => `
                    <a
                        href="${repo.html_url}"
                        target="_blank"
                        class="repo"
                    >
                        <strong>${repo.name}</strong>
                        <p>${repo.description || "No description available."}</p>

                        <span>
                            ⭐ ${repo.stargazers_count}
                            ${repo.language ? ` • ${repo.language}` : ""}
                        </span>
                    </a>
                `).join("")}
            </div>

        </div>
    `;
}

searchButton.addEventListener("click", searchGitHubUser);

usernameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchGitHubUser();
    }
});