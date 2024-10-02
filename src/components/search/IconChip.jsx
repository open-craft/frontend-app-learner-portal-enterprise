import { Badge, Chip, Icon } from '@openedx/paragon';
import PropTypes from 'prop-types';

const IconChip = ({ accent, icon, text }) => (
  <div className={`x-small align-items-center d-flex font-weight-bold text-${accent}`}>
    <Badge variant={accent} className="p-1 mr-1">
      <Icon src={icon} className="tiny-icon" />
    </Badge>
    <span>{text}</span>
  </div>
);

IconChip.propTypes = {
  accent: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  text: PropTypes.string,
};

IconChip.defaultProps = {
  text: '',
  icon: null,
};

export default IconChip;
