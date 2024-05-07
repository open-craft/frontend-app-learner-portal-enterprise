import {
  Alert, Button, Card, Icon, ProgressBar, useMediaQuery, breakpoints,
} from '@edx/paragon';
import {
  AccessTime,
  Info,
  List,
  RadioButtonUnchecked,
} from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { ReactComponent as Book2 } from '@material-symbols/svg-400/outlined/book_2-fill.svg';
import { ReactComponent as IncompleteCircle } from '@material-symbols/svg-400/outlined/incomplete_circle-fill.svg';

import dayjs from '../../../../../utils/dayjs';
import IconChip from '../../../../search/IconChip';
import FullChip from '../../../../search/FullChip';
import { PROGRESS_STATE } from './constants';
import { COURSE_STATUSES, COURSE_PACING } from '../../../../../constants';

const SPACER = '\u00A0';

const PROGRESS_PROPS_BY_STATUS = {
  [COURSE_STATUSES.inProgress]: {
    accent: 'dark-turquoise',
    icon: IncompleteCircle,
  },
  [COURSE_STATUSES.upcoming]: {
    accent: 'slate',
    icon: RadioButtonUnchecked,
  },
  [COURSE_STATUSES.requested]: {
    accent: 'slate',
    icon: RadioButtonUnchecked,
  },
  [COURSE_STATUSES.assigned]: {
    accent: 'slate',
    icon: RadioButtonUnchecked,
  },
};

const NewCourseCard = ({
  title,
  courseRunStatus,
  linkToCourse,
  orgName,
  startDate,
  endDate,
  accessUntil,
  size,
  progress,
  linkToCertificate,
  infoAlert,
  course,
}) => {
  const accent = 'mortar';
  const cardType = 'COURSE';
  const cardTypeIcon = Book2;

  // NOTE: The Figma design involves showing the course duration in the subtitle.
  // Since the courses are open for multiple years in some cases, this shows strange
  // values like 76months. So, it is hidden for now.
  //
  // let duration = dayjs(endDate).diff(startDate, 'M');
  // let durationStr = 'Months';
  // if (duration < 1) {
  //   duration = dayjs(endDate).diff(startDate, 'w');
  //   durationStr = 'Weeks';
  // }
  // if (duration < 1) {
  //   duration = dayjs(endDate).diff(startDate, 'd');
  //   durationStr = 'Days';
  // }
  // let cardSubTitle = orgName;
  // if (duration) {
  //   cardSubTitle = `${orgName}${SPACER}${SPACER}•${SPACER}${SPACER}${duration} ${durationStr}`;
  // }

  const renderProgressChip = () => {
    const { icon, accent: chipAccent } = PROGRESS_PROPS_BY_STATUS[courseRunStatus];
    return (
      <div className="ml-auto d-flex">
        <FullChip
          accent={chipAccent}
          icon={icon}
          text={courseRunStatus.toUpperCase().replace('_', ' ')}
        />
      </div>
    );
  };

  const renderActions = () => {
    const viewResumeText = courseRunStatus === COURSE_STATUSES.inProgress ? 'Resume' : 'View';
    return (
      <>
        {linkToCertificate && (
          <Button
            variant="tertiary mr-1"
            href={linkToCertificate}
          >
            Grades
          </Button>
        )}
        <Button
          variant="outline-primary"
          href={linkToCourse}
        >
          {viewResumeText}
        </Button>
      </>
    );
  };

  let cardClass = '';
  if (infoAlert) {
    cardClass += ' border-radius-bottom-zero';
  }
  const orientation = useMediaQuery({ maxWidth: breakpoints.medium.minWidth }) ? 'vertical' : 'horizontal';

  return (
    <>
      <Card
        orientation={orientation}
        className={cardClass}
        style={{ maxHeight: orientation === 'horizontal' ? '230px' : '' }}
      >
        <Card.ImageCap
          src={course.cardImageUrl || course.image?.url}
          srcAlt=""
          logoSrc={course.owners?.length ? course.owners[0].logoImageUrl : ''}
          logoAlt={orgName}
          className="cic-image-cap top-left-logo"
        />
        <Card.Body className={`accented-body border-${accent}`}>
          <div className="my-3 mx-3 d-flex">
            <IconChip accent={accent} icon={cardTypeIcon} text={cardType} />
            {renderProgressChip()}
          </div>
          <Card.Header
            title={title}
            subtitle={course.owners?.length ? course.owners[0].name : orgName}
            className="compact-header"
          />
          {progress && (
            <Card.Section className="x-small pb-1 pt-1">
              <ProgressBar.Annotated
                now={progress}
                label={`${progress}%`}
                variant="dark"
              />
            </Card.Section>
          )}
          <Card.Footer className="justify-content-start">
            {size && (
              <span className="micro d-flex align-items-center mr-3">
                <Icon className="mr-1" size="sm" src={List} /> {size}
              </span>
            )}
            {/* TODO: make date bold in accessUntil string, probably need to add intl */}
            {endDate && (
              <span className="micro d-flex align-items-center">
                <Icon className="mr-1" size="sm" src={AccessTime} /> Access until: {dayjs(endDate).format('DD MMM, YYYY')}
              </span>
            )}
            <div className="ml-auto">
              {renderActions()}
            </div>
          </Card.Footer>
        </Card.Body>
      </Card>
      {infoAlert
        && (
          <Alert variant="info" className="p-2 border-radius-top-zero bg-light-gray" icon={Info}>
            {infoAlert}
          </Alert>
        )}
    </>
  );
};

NewCourseCard.propTypes = {
  title: PropTypes.string.isRequired,
  courseRunStatus: PropTypes.oneOf(Object.values(COURSE_STATUSES)).isRequired,
  linkToCourse: PropTypes.string.isRequired,
  orgName: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  accessUntil: PropTypes.string,
  size: PropTypes.string,
  progress: PropTypes.number.isRequired,
  linkToCertificate: PropTypes.string,
  infoAlert: PropTypes.string,
  course: PropTypes.shape({
    cardImageUrl: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
    owners: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      logoImageUrl: PropTypes.string,
    })),
  }),
};

NewCourseCard.defaultProps = {
  accessUntil: '',
  size: '',
  infoAlert: '',
  linkToCertificate: '',
  course: {},
  orgName: '',
  startDate: null,
  endDate: null,
};

export default NewCourseCard;
