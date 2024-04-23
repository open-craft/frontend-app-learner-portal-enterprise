import { Chip } from "@edx/paragon"
import PropTypes from 'prop-types';

const FullChip = ({accent, icon, text, className}) => {
  return (
    <Chip className={`bg-${accent} ${className}`} variant="dark" iconBefore={icon}>
      {text}
    </Chip>
  )
}

FullChip.propTypes = {
  accent: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  text: PropTypes.string,
  className: PropTypes.string,
}

FullChip.defaultProps = {
  className: "",
  text: "",
  icon: null,
}

export default FullChip;
