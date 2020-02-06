'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      // TODO: replace this comment and the console.log with your own code
      // console.log('ContributorsView', contributors);
      this.container.innerHTML = '';
      const ul = createAndAppend('ul', this.container);
      contributors.forEach(contributor => {
        const li = createAndAppend('li', ul, {
          class: 'contribution-container',
        });
        createAndAppend('img', li, {
          src: contributor.avatar_url,
          class: 'contribution-avatar',
        });
        createAndAppend('a', li, {
          text: contributor.login,
          href: contributor.html_url,
          class: 'contribution-name',
          target: '_blank',
        });
        createAndAppend('span', li, {
          text: contributor.contributions,
          class: 'contribution-number',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}
