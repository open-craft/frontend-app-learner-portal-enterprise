import { Navbar } from '@edx/paragon';
import PropTypes from 'prop-types';
import { SearchBox, connectStateResults } from 'react-instantsearch-dom';
import { useNbHitsFromSearchResults } from '@edx/frontend-enterprise-catalog-search';

const SearchHeader = ({ searchResults }) => {
  const nbHits = useNbHitsFromSearchResults(searchResults);

  return (
    <Navbar expand="lg">
      <div>
        <Navbar.Brand as="h1">
          Explore

        </Navbar.Brand>
        {/*
            TODO: find the right way to implement this
        <small className="ml-3">Showing {nbHits} of {totalItems}</small>
        */}
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <div className="ml-auto">
          <SearchBox autoFocus searchAsYouType={false} showLoadingIndicator />
        </div>
      </Navbar.Collapse>
    </Navbar>

  );
};

SearchHeader.propTypes = {
  searchResults: PropTypes.shape({
    nbHits: PropTypes.number,
    hits: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

SearchHeader.defaultProps = {
  searchResults: {
    nbHits: 0,
    hits: [],
  },
};

export default connectStateResults(SearchHeader);
