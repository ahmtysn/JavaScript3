'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(currentRepo) {
      console.log('classsss');
      this.container.innerHTML = '';
      const li = createAndAppend('li', this.container);
      const table = createAndAppend('table', li);
      const titles = ['Repository:', 'Description:', 'Forks:', 'Updated:'];
      const keys = ['name', 'description', 'forks', 'updated_at'];

      for (let i = 0; i < titles.length; ++i) {
        let tr = createAndAppend('tr', table);
        createAndAppend('th', tr, { text: titles[i] });
        if (i) createAndAppend('td', tr, { text: currentRepo[keys[i]] });
        else {
          const td = createAndAppend('td', tr);
          createAndAppend('a', td, {
            href: currentRepo.html_url,
            text: currentRepo.name,
            target: '_blank',
          });
        }
      }
    }
  }

  window.RepoView = RepoView;
}
