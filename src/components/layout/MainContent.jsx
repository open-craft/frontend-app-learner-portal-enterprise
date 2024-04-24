import React from 'react';
import PropTypes from 'prop-types';

const MainContent = props => (
  <article className={`col-xs-12 col-lg-9 ${props.className}`}>
    {props.children}
  </article>
);

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

MainContent.defaultProps = {
  className: '',
};

export default MainContent;
