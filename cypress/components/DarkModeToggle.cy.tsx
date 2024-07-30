import React from 'react';
import DarkModeToggle from '~/components/DarkModeToggle';

import { ThemeProvider } from 'next-themes';

describe('DarkModeToggle Component', () => {
  const TOGGLE_BUTTON = '.dark-mode-toggle';
  const THEME_DROPDOWN = '[data-test="theme-dropdown"]';
  const THEME_ICON = '[data-test="theme-icon"]';

  const mountComponent = () => {
    cy.mount(
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'white',
        }}
      >
        <ThemeProvider>
          <DarkModeToggle />
        </ThemeProvider>
      </div>,
    );
  };

  beforeEach(mountComponent);

  it('should render the component', () => {
    cy.get(TOGGLE_BUTTON).should('exist');
  });

  describe('Theme Dropdown Menu', () => {
    it('should open the menu on button click', () => {
      cy.get(TOGGLE_BUTTON).click();
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');
    });

    it('should close the menu on button click when open', () => {
      cy.get(TOGGLE_BUTTON).click();
      cy.get(TOGGLE_BUTTON).click();
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
    });

    it('should close the menu on mouse leave', () => {
      cy.get(TOGGLE_BUTTON).click();
      cy.get(THEME_DROPDOWN).trigger('mouseout');
      cy.get(THEME_DROPDOWN).should('have.css', 'display', 'none');
    });
  });

  describe('Theme Selection', () => {
    const themes = [
      {
        name: 'system',
        selector: '[data-test="select-system-theme"]',
        icon: '/icons/theme-switch.svg',
      },
      {
        name: 'dark',
        selector: '[data-test="select-dark-theme"]',
        icon: '/icons/moon.svg',
      },
      {
        name: 'light',
        selector: '[data-test="select-light-theme"]',
        icon: '/icons/sun.svg',
      },
    ];

    themes.forEach((theme) => {
      it(`should change the theme to ${theme.name}`, () => {
        cy.get(TOGGLE_BUTTON).click();
        cy.get(THEME_DROPDOWN).should('have.css', 'display', 'block');
        cy.get(theme.selector).click();
        cy.get(THEME_ICON).should('have.attr', 'src', theme.icon);
        cy.get(THEME_DROPDOWN).trigger('mouseout', { force: true });
      });
    });

    it('should initially have system theme', () => {
      cy.get(THEME_ICON).should('have.attr', 'src', '/icons/theme-switch.svg');
    });
  });
});
