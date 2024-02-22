
class GitHub { 

    constructor() { 
        this.base_url = 'https://api.github.com/users/'; 
    }


    async getUser(username) {
        const profileResponse = await fetch(`${this.base_url}${username}`); 
        const profile = await profileResponse.json();

        const reposResponse = await fetch(`${this.base_url}${username}/repos`); 
        const repos = await reposResponse.json(); 

        return { profile, repos }; 
    }
}


class UI {
    showProfile(user) { 
        const profileHTML = `
        <div class="card card-body mb-3">
        <div class="row">
            <div class="col-md-3">
                <img class="img-fluid mb-2" src="${user.avatar_url}">
                <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
            </div>
            <div class="col-md-9">
                <span class="badge bg-primary">Public Repos: ${user.public_repos}</span>
                <span class="badge bg-secondary">Public Gists: ${user.public_gists}</span>
                <span class="badge bg-success">Followers: ${user.followers}</span>
                <span class="badge bg-info">Following: ${user.following}</span>
                <br><br>
                <ul class="list-group">
                    <li class="list-group-item">Company: ${user.company}</li>
                    <li class="list-group-item">Website/Blog: ${user.blog}</li>
                    <li class="list-group-item">Location: ${user.location}</li>
                    <li class="list-group-item">Member Since: ${user.created_at}</li>
                </ul>
            </div>
        </div>
    </div>
`;
        document.getElementById('profile').innerHTML = profileHTML;
    }

    showRepos(repos) {
        let reposHTML = '<h3 class="page-heading mb-3">Latest Repos</h3>';
        repos.forEach(repo => {
            reposHTML += `
                <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge bg-primary">Stars: ${repo.stargazers_count}</span>
                            <span class="badge bg-secondary">Watchers: ${repo.watchers_count}</span>
                            <span class="badge bg-success">Forks: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById('profile').innerHTML += reposHTML;
    }

    showAlert(message, className) {
     
        this.clearAlert();
    
    
        const div = document.createElement('div');
        div.className = className;
        div.appendChild(document.createTextNode(message));
    
    
        const container = document.querySelector('.SearchContainer');
        const search = document.querySelector('.search');
        container.insertBefore(div, search);

        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }
    
    clearAlert() {
        const currentAlert = document.querySelector('.alert');
        if (currentAlert) {
            currentAlert.remove();
        }
    }
    


}


const github = new GitHub();


const ui = new UI(); 


document.getElementById('searchBtn').addEventListener('click', () => {


    const userText = document.getElementById('searchUser').value;
    
    if (userText !== '') { 
        github.getUser(userText)
            .then(data => {
                if (data.profile.message === 'Not Found') { 
                    ui.showAlert(data.profile.message, 'alert alert-danger'); 
                } else { 
                    ui.showProfile(data.profile);
                    ui.showRepos(data.repos); 
                }
            });
    }
});

