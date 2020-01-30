'use strict';

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

function renderRepoDetails(repo, ulRepo) {
  const li = createAndAppend('li', ulRepo);
  const table = createAndAppend('table', li);
  const titles = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
  const keys = ['name', 'description', 'forks', 'updated_at'];

  for (let i = 0; i < titles.length; ++i) {
    let tr = createAndAppend('tr', table);
    createAndAppend('th', tr, { text: titles[i] });
    if (i) createAndAppend('td', tr, { text: repo[keys[i]] });
    else {
      const td = createAndAppend('td', tr);
      createAndAppend('a', td, {
        href: repo.html_url,
        text: repo.name,
        target: '_blank',
      });
    }
  }
}

function renderContributor(data, ulContributor) {
  for (let i = 0; i < data.length; ++i) {
    const li = createAndAppend('li', ulContributor, {
      class: 'contribution-container',
    });
    createAndAppend('img', li, {
      src: data[i].avatar_url,
      class: 'contribution-avatar',
    });
    createAndAppend('a', li, {
      text: data[i].login,
      href: data[i].html_url,
      target: '_blank',
      class: 'contribution-name',
    });
    createAndAppend('span', li, {
      text: data[i].contributions,
      class: 'contribution-number',
    });
  }
}

const select = document.querySelector('header select');
const root = document.getElementById('root');
const repoContainer = document.querySelector('.repo-container');
const contributorsContainer = document.querySelector('.contributors-container');

function main(url) {
  fetchJSON(url, (err, repos) => {
    if (err) {
      createAndAppend('div', root, {
        text: err.message,
        class: 'alert-error',
      });
      return;
    }
    const ulRepo = createAndAppend('ul', repoContainer);
    const ulContributor = createAndAppend('ul', contributorsContainer);

    repos
      .sort((curRepo, nextRepo) => curRepo.name.localeCompare(nextRepo.name))
      .forEach(repo => {
        let repoName = repo.name.toLowerCase();
        createAndAppend('option', select, {
          value: repo.name,
          text: repoName,
        });
      });

    select.addEventListener('change', () => {
      fetch(
        `https://api.github.com/repos/HackYourFuture/${select.value}/contributors`,
      )
        .then(res => res.json())
        .then(data => {
          ulContributor.innerHTML = '';
          renderContributor(data, ulContributor);
        })
        .catch(err => console.error(err));

      ulRepo.innerHTML = '';
      repos
        .filter(repo => repo.name === select.value)
        .forEach(repo => renderRepoDetails(repo, ulRepo));
    });
  });
}
const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);
