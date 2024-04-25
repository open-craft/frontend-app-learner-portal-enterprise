import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import { Stack } from '@edx/paragon';
import { useNbHitsFromSearchResults } from '@edx/frontend-enterprise-catalog-search';

import SearchFilter from './SearchFilter';

const SearchSidebar = ({ searchResults }) => {
  const nbHits = useNbHitsFromSearchResults(searchResults);

  return (
    <>
      <h4 className="h4 my-4">Filters</h4>
      <Stack gap={4}>
        {!nbHits && <p>No results to filter</p>}
        <SearchFilter title="Subject" attribute="subject" />
        <SearchFilter title="Duration" attribute="course_length" />
      </Stack>
    </>
  );
};

SearchSidebar.propTypes = {
  searchResults: PropTypes.shape({
    nbHits: PropTypes.number,
    hits: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default connectStateResults(SearchSidebar);
