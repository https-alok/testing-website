import React from 'react';
import Card from '../../components/Card';
import '../../styles/globals.css';
import { CardProps } from '../../components/Card';

const RoadmapProps: CardProps = {
  icon: '/icons/roadmap.svg',
  title: 'Roadmap',
  body: 'Explore our exciting plans and upcoming milestones. 🚀',
  headerSize: 'large',
  bodyTextSize: 'medium',
  link: 'https://github.com/orgs/json-schema-org/discussions/427',
  extended: true,
};

// const OverviewProps: CardProps = {
//   icon: '/icons/eye.svg',
//   title: 'Overview',
//   body: 'Our Overview provides a high level view of the project, its benefits, the roadmap and other relevant details.',
//   headerSize: 'medium',
//   bodyTextSize: 'small',
//   link: '/overview/what-is-jsonschema',
// };

describe('Card Component', () => {
  const testCardRendering = (props: CardProps) => {
    cy.mount(<Card {...props} />);
    cy.get('[data-test="card-image"]').should('not.exist');
    cy.get('[data-test="card-icon"]').should('have.attr', 'src', props.icon);
    cy.get('[data-test="card-title"]').should('have.text', props.title);
    cy.get('[data-test="card-title"]').should(
      'have.class',
      'mb-1 mt-1 items-center font-bold text-gray-900 dark:text-white',
    );
    cy.get('[data-test="card-body"]').should('have.text', props.body);
    cy.get('[data-test="card-body"]').should(
      'have.class',
      'mb-8 text-black mt-5 dark:text-white',
    );
    cy.get('[data-test="card-read-more"]').should('have.text', 'Read More');
    cy.get('[data-test="card-link"]').should('have.attr', 'href', props.link);
    cy.get('[data-test="card-hr"]').should('exist');
    cy.get('[data-test="card-body"]').find('span').should('exist');
    // check span tag is present in the card body
  };

  // Render the Roadmap Card with the correct header and body text sizes
  it('should render Roadmap Card correctly', () => {
    testCardRendering(RoadmapProps);
    cy.get('[data-test="card-body"]').should('have.class', 'text-[1rem]');
  });

  it('should render Roadmap card when size is not provided', () => {
    const props = {
      ...RoadmapProps,
      headerSize: undefined,
      bodyTextSize: undefined,
    };
    testCardRendering(props);
    cy.get('[data-test="card-body"]').should('have.class', 'text-[1rem]');
    cy.get('[data-test="card-title"]').should('have.class', 'text-[1.3rem]');
  });

  it('should render Roadmap card with image', () => {
    const props = {
      ...RoadmapProps,
      icon: undefined,
      image: '/images/roadmap.jpg',
    };
    cy.mount(<Card {...props} />);
    cy.get('[data-test="card-icon"]').should('not.exist');
    cy.get('[data-test="card-image"]').should('have.attr', 'src', props.image);
  });

  it('should render Roadmap card without Extended body', () => {
    const props = { ...RoadmapProps, extended: false };
    cy.mount(<Card {...props} />);
    // cy.get('[data-test="card-body"]').should('not.have.text', props.body);
    cy.get('[data-test="card-body"]').find('span').should('exist');
  });

  // Render the Card with some missing props
  it('should render card with some missing props correctly', () => {
    const missingProps = { ...RoadmapProps, icon: undefined, link: undefined };
    cy.mount(<Card {...missingProps} />);
    cy.get('[data-test="card-icon"]').should('not.exist');
    cy.get('[data-test="card-read-more"]').should('not.exist');
    cy.get('[data-test="card-link"]').should('not.exist');
  });
});
