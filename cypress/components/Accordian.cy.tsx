import React from 'react';
import Accordion, { AccordionProps } from '~/components/Accordion';
import mockNextRouter, { MockRouter } from '../support/mockNextRouterUtils';

const items: AccordionProps['items'] = [
  {
    question: 'What is JSON Schema?',
    answer:
      'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It is used to define the structure of JSON data for documentation, validation, and interaction control.',
    id: 1,
  },
  {
    question: 'What is JSON Schema used for?',
    answer:
      'JSON Schema is used to define the structure of JSON data for documentation, validation, and interaction control.',
    id: 2,
  },
  {
    question: 'What is JSON Schema validation?',
    answer:
      'JSON Schema validation is the process of ensuring that a JSON document is correctly formatted and structured according to a JSON Schema.',
    id: 3,
  },
];

describe('Accordion Component', () => {
  let mockRouter: MockRouter;
  beforeEach(() => {
    mockRouter = mockNextRouter();
    cy.mount(<Accordion items={items} />);
  });

  it('should render the Accordion Items correctly', () => {
    items.forEach((item) => {
      cy.get(`[data-test="accordion-item-${item.id}"]`)
        .should('exist')
        .within(() => {
          cy.get(`[data-test=accordion-question-${item.id}]`).should(
            'have.text',
            item.question,
          );
          cy.get(`[data-test=accordion-question-${item.id}]`).click();

          cy.get('@routerPush').should('have.been.calledWith', `#${item.id}`);
          cy.get(`[ data-test=accordion-answer-${item.id}]`).should(
            'have.text',
            item.answer,
          );
        });
      cy.get(`[data-test=accordion-item-${item.id}]`).should(
        'have.class',
        'max-h-96',
      );
    });
  });

  it('should handle the toggle correctly', () => {
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-20',
    );

    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-96',
    );
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-20',
    );
  });

  it('should scroll when router asPath changes', () => {
    const scrollToSpy = cy.spy(window, 'scrollTo');

    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-20',
    );
    cy.get(`[data-test="accordion-toggle-${items[0].id}"]`).click();

    // Simulate route change
    mockRouter.asPath = `#${items[0].id}`;
    cy.wrap(null).then(() => {
      // Trigger useEffect
      Cypress.$(window).trigger('hashchange');
    });

    // Check if the accordion item is expanded
    cy.get(`[data-test="accordion-item-${items[0].id}"]`).should(
      'have.class',
      'max-h-96',
    );

    // Check if scrollTo was called
    cy.wrap(scrollToSpy).should('have.been.called');

    // If you want to be more specific about the scrollTo parameters:
    cy.wrap(scrollToSpy).should('have.been.calledWithMatch', {
      top: Cypress.sinon.match.number,
      behavior: 'smooth',
    });
  });

  it('should not scroll when hash does not match any item', () => {
    const scrollToSpy = cy.spy(window, 'scrollTo');

    // Simulate route change with non-existent hash
    mockRouter.asPath = '#nonexistent';
    cy.wrap(null).then(() => {
      // Trigger useEffect
      Cypress.$(window).trigger('hashchange');
    });

    // Check that no items are expanded
    items.forEach((item) => {
      cy.get(`[data-test="accordion-item-${item.id}"]`).should(
        'have.class',
        'max-h-20',
      );
    });

    // Check that scrollTo was not called
    cy.wrap(scrollToSpy).should('not.have.been.called');
  });
});
