'use strict';

const root = document.getElementById('root');
const repoContainer = document.querySelector('.repo-container');
const contributorsContainer = document.querySelector('.contributors-container');
const ulRepo = createAndAppend('ul', repoContainer);
const ulContributor = createAndAppend('ul', contributorsContainer);

async function fetchAPI(url) {
  const response = await axios.get(url);
  return response.data;
}
async function main(url) {
  try {
    const repos = await fetchAPI(url);
    const select = document.querySelector('header select');
    const sortedRepo = repos.sort((curRepo, nextRepo) =>
      curRepo.name.localeCompare(nextRepo.name),
    );
    renderRepoDetails(sortedRepo[0], ulRepo);
    sortedRepo.forEach(repo => {
      let repoName = repo.name.toLowerCase();
      createAndAppend('option', select, {
        value: repo.name,
        text: repoName,
      });
    });
    select.addEventListener('change', () => {
      repoSelection(select, repos);
    });
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
}
async function repoSelection(select, repos) {
  try {
    const response = await axios(
      `https://api.github.com/repos/HackYourFuture/${select.value}/contributors`,
    );
    const data = response.data;
    ulContributor.innerHTML = '';
    ulRepo.innerHTML = '';
    contributorsContainer.classList.remove('noneDisplay');
    repos
      .filter(repo => repo.name === select.value)
      .forEach(repo => renderRepoDetails(repo, ulRepo));
    renderContributor(data, ulContributor);
  } catch (err) {
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert-error',
    });
  }
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

const hyfURL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(hyfURL);
