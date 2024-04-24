import { Form } from '@edx/paragon';
import { connectRefinementList } from 'react-instantsearch-dom';

// Implementation based on sample code from
// https://www.algolia.com/doc/deprecated/instantsearch/react/v6/guides/customize-an-existing-widget/#style-your-widgets

const SearchFilter = connectRefinementList(
  ({
    title, items, refine,
  }) => (
    items.length
      ? (
        <Form.Group>
          <Form.Label className="font-weight-bold text-black mb-3">{title}</Form.Label>
          <Form.CheckboxSet
            name={title}
            onChange={(e) => refine(e.target.value)}
          >
            {items.map(item => (
              <Form.Checkbox key={item.value} value={item.value} checked={item.isRefined}>{item.label}</Form.Checkbox>
            ))}
          </Form.CheckboxSet>
        </Form.Group>
      ) : null
  ),
);

export default SearchFilter;
