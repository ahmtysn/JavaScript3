'use strict';
{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  // function renderRepoDetails(repo, ul) {
  //   const li = createAndAppend('li', ul);
  //   const table = createAndAppend('table', li);

  //   //tr-repository
  //   let tr = createAndAppend('tr', table);
  //   createAndAppend('th', tr, { text: 'Repository: ' });
  //   let td = createAndAppend('td', tr);
  //   createAndAppend('a', td, {
  //     href: repo.html_url,
  //     text: repo.name,
  //     target: '_blank',
  //   });

  //   //tr-description
  //   tr = createAndAppend('tr', table);
  //   createAndAppend('th', tr, { text: 'Description: ' });
  //   td = createAndAppend('td', tr, { text: repo.description });

  //   //tr-forks
  //   tr = createAndAppend('tr', table);
  //   createAndAppend('th', tr, { text: 'Forks: ' });
  //   td = createAndAppend('td', tr, { text: repo.forks });

  //   //tr-update
  //   tr = createAndAppend('tr', table);
  //   createAndAppend('th', tr, { text: 'Updated: ' });
  //   td = createAndAppend('td', tr, { text: repo.updated_at });
  // }

  function renderRepoDetails(repo, ul) {
    const li = createAndAppend('li', ul);
    const table = createAndAppend('table', li);
    const titles = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
    const keys = ['name', 'description', 'forks', 'updated_at'];

    for (let i = 0; i < titles.length; ++i) {
      let tr = createAndAppend('tr', table);
      createAndAppend('th', tr, { text: titles[i] });
      if (i) createAndAppend('td', tr, { text: repo[keys[i]] });
      // i is 1,2 or 3 (true values)
      else {
        // false value, (i=0)
        const td = createAndAppend('td', tr);
        createAndAppend('a', td, {
          href: repo.html_url,
          text: repo.name,
          target: '_blank',
        });
      }
    }
  }
  const root = document.getElementById('root');
  function main(url) {
    createAndAppend('header', root, { text: 'HYF Repositories' });
    fetchJSON(url, (err, repos) => {
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos
        .sort((curRepo, nextRepo) => curRepo.name.localeCompare(nextRepo.name))
        .forEach(repo => renderRepoDetails(repo, ul));
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
