import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = props => (
  <aside className="col-12 col-lg-3 bg-white" {...props}>
    {props.children}
  </aside>
);

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;
