$(function () {

    let data = {
        client_id: 'e592fbf178dfa3f6338c',
        client_secret: 'd98c31b3f2c8b5905cc3889d1bbaf10661b41ecf',
    };
    // 去抖
    let timer

    $user = $('.user-input');

    $user.on('keyup', function () {
        clearTimeout(timer);
        if ($user.val().length === 0) {
            clear();
            return;
        }

        timer = setTimeout(function () {
            $.ajax({
                url: `https://api.github.com/users/${$user.val()}`,
                data,
                error:() => {clear();console.log('NotFound')}
            }).then(function (user) {
                showProfile(user);
            })

            $.ajax({
                url: `https://api.github.com/users/${$user.val()}/repos`,
                data,
                error:() => {clear();console.log('NotFound')},
            }).then(function (repos) {
                showRepos(repos);
            })
        }, 500)

    })



    function clear() {
        $('.profile').html('');
        $('.repos').html('');
    }


    function showProfile(user) {
        $('.profile').html(`
            <div class='card'>
                <div class='card-header'>
                    <p class='card-header-title'>${user.name}</p>
                </div>
                <div class='user'>
                    <img class='avatar' src='${user.avatar_url}' alt='${user.name}'>
                    <div class='info'>
                        <p class='item'>关注数 <strong>${user.following}</strong></p>
                        <p class="item">粉丝数 <strong>${user.followers}</strong></p>
                        <p class="item">仓库数 <strong>${user.public_repos}</strong></p>
                        <p class="item">所在地 <strong>${user.location}</strong></p>
                    </div>
                </div>
                <div class='card-footer'>
                    <a class="card-footer-item" href="${user.html_url}" target="_blank">
                        <i class="octicon octicon-mark-github" style="margin-right: 8px"></i>
                        Github 主页
                    </a>
                </div>
            </div>
        `)
    }


    function showRepos(repos) {
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        // repos.sort(function(a, b) {
        //     return b["stargazers_count"] - a["stargazers_count"];
        // });
        let reposHTML = repos.map(function (repo) {
            return `<a href="${repo.html_url}" class="panel-block panel-repo" target="_blank">
                        <span class="panel-icon"><i class="octicon octicon-repo"></i></span>
                        ${repo.name}
                        <span class="star-count">${repo.stargazers_count}</span> 
                        <i class="octicon octicon-star"></i>
                        </a>`
        }).join('');

        $('.repos').html(`
            <div class="panel">
                <p class="panel-heading repo">
                <i class="octicon octicon-list-unordered"></i>
                  仓库列表
                </p>
            </div>`+reposHTML)
    }
})

