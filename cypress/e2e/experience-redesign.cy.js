describe('portfolio experience redesign', () => {
  it('renders the main story without horizontal overflow at target widths', () => {
    for (const width of [1440, 1280, 1024, 768, 414, 390, 375, 320]) {
      cy.viewport(width, 900);
      if (width === 1440) cy.visit('/');
      cy.contains('#home h1', 'Making data', { timeout: 20000 }).should('be.visible');
      cy.get('#portfolio').should('exist');
      cy.window().then((win) => {
        expect(win.document.documentElement.scrollWidth, `document width at ${width}px`).to.be.at.most(width);
      });
    }
  });

  it('opens the full-screen mobile menu and closes it with Escape', () => {
    cy.viewport(390, 844);
    cy.visit('/');
    cy.contains('#home h1', 'Making data', { timeout: 20000 }).should('be.visible');
    cy.get('.lab-menu-toggle').should('be.visible').click().should('have.attr', 'aria-expanded', 'true');
    cy.contains('#mobile-navigation a', 'Work').should('be.visible');
    cy.contains('#mobile-navigation a', 'Resume').should('be.visible');
    cy.get('body').should('have.css', 'overflow', 'hidden');
    cy.get('body').type('{esc}');
    cy.get('.lab-menu-toggle').should('have.attr', 'aria-expanded', 'false').and('be.focused');
  });

  it('loads case studies directly and supports back/forward navigation', () => {
    cy.visit('/project/smart-library-analytics');
    cy.contains('h1', 'Smart Library Analytics Platform').should('be.visible');
    cy.reload();
    cy.contains('h1', 'Smart Library Analytics Platform').should('be.visible');
    cy.get('.case-next-link').click();
    cy.location('pathname').should('eq', '/project/financial-forecasting-system');
    cy.contains('h1', 'Financial Forecasting System').should('be.visible');
    cy.go('back');
    cy.contains('h1', 'Smart Library Analytics Platform').should('be.visible');
    cy.go('forward');
    cy.contains('h1', 'Financial Forecasting System').should('be.visible');
  });

  it('shows a useful not-found state for unknown project routes', () => {
    cy.visit('/project/not-a-real-project');
    cy.contains('h1', 'This trail ends here.').should('be.visible');
    cy.contains('Back to selected work').should('have.attr', 'href', '/#portfolio');
  });

  it('keeps a keyboard-operable credentials dialog', () => {
    cy.visit('/');
    cy.contains('button', 'View credential').first().click();
    cy.get('[role="dialog"]').should('be.visible').and('have.attr', 'aria-modal', 'true');
    cy.get('[aria-label="Close certificate details"]').should('be.focused');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });
});
