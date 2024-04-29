import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cardFallbackImg from '@edx/brand/paragon/images/card-imagecap-fallback.png';
import { useHistory } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform/config';
import { camelCaseObject } from '@edx/frontend-platform/utils';
import {
  Button, Card, Icon, Stack, Truncate,
} from '@edx/paragon';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import { AccessTimeFilled, Calendar } from '@edx/paragon/icons';
import { ReactComponent as Book2 } from '@material-symbols/svg-400/outlined/book_2-fill.svg';

import FullChip from './FullChip';
import { getPrimaryPartnerLogo, isDefinedAndNotNull } from '../../utils/common';
import { GENERAL_LENGTH_COURSE, SHORT_LENGTH_COURSE } from './data/constants';
import { isShortCourse } from './utils';
import { UserSubsidyContext } from '../enterprise-user-subsidy';

const SearchCourseCard = ({
  key, hit, isLoading, ...rest
}) => {
  const { enterpriseConfig: { slug, uuid } } = useContext(AppContext);
  const history = useHistory();
  const { subscriptionPlan } = useContext(UserSubsidyContext);

  const eventName = useMemo(
    () => {
      if (key?.startsWith('career-tab')) {
        return 'edx.ui.enterprise.learner_portal.career_tab.course_recommendation.clicked';
      }
      return 'edx.ui.enterprise.learner_portal.search.card.clicked';
    },
    [key],
  );

  const course = useMemo(
    () => {
      if (!hit) {
        return {};
      }
      return camelCaseObject(hit);
    },
    [hit],
  );

  const linkToCourse = useMemo(
    () => {
      if (!Object.keys(course).length) {
        return undefined;
      }
      const queryParams = new URLSearchParams();
      if (course.queryId && course.objectId) {
        queryParams.set('queryId', course.queryId);
        queryParams.set('objectId', course.objectId);
      }
      return `/${slug}/course/${course.key}?${queryParams.toString()}`;
    },
    [course, slug],
  );

  const partnerDetails = useMemo(
    () => {
      if (!Object.keys(course).length || !isDefinedAndNotNull(course.partners)) {
        return {};
      }

      return {
        primaryPartner: course.partners?.length > 0 ? course.partners[0] : undefined,
        showPartnerLogo: course.partners?.length === 1,
      };
    },
    [course],
  );

  const isShortLengthCourse = isShortCourse(course);

  const primaryPartnerLogo = getPrimaryPartnerLogo(partnerDetails);

  const handleCardClick = () => {
    if (!linkToCourse) {
      return;
    }
    sendEnterpriseTrackEvent(
      uuid,
      eventName,
      {
        objectID: course.objectId,
        position: course.position,
        index: getConfig().ALGOLIA_INDEX_NAME,
        queryID: course.queryId,
        courseKey: course.key,
      },
    );
    history.push(linkToCourse);
  };

  const accessUntil = subscriptionPlan
    ? new Date(subscriptionPlan.expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';
  /**
   * TODO: Get enrollment status'
   * Currently the user's enrollment status is fetched only in the course service
   * and made available in the CourseService. The endpoint however fetches all the
   * enterprise enrollments of the user. This needs to be refactored out before
   * we can start showing the enrollment status on the search page.
   * */
  const enrolled = '';

  return (
    <Card
      data-testid="search-course-card"
      isLoading={isLoading}
      isClickable
      onClick={(e) => {
        handleCardClick(e);
      }}
      className="border-mortar border-bottom-5"
      style={{ width: '320px', height: '380px' }}
      {...rest}
    >
      <Card.ImageCap
        src={course.cardImageUrl || course.originalImageUrl || cardFallbackImg}
        fallbackSrc={cardFallbackImg}
        srcAlt=""
        logoSrc={primaryPartnerLogo?.src}
        logoAlt={primaryPartnerLogo?.alt}
        className="cic-image-cap"
      />
      <Card.Header
        title={(
          <>
            <FullChip accent="mortar" icon={Book2} text="Course" className="mb-3" />
            {enrolled && (<FullChip accent="indigo" text="ENROLLED" />)}
            <Truncate maxLine={1}>{course.title}</Truncate>
          </>
        )}
        subtitle={course.partners?.length > 0 && (
          <Truncate maxLine={2}>
            {course.partners.map(partner => partner.name).join(', ')}
          </Truncate>
        )}
        className="line-height-24px"
        size="sm"
      />
      <Card.Section className="x-small pb-1">
        <Stack direction="vertical" gap={2}>
          {course.courseLength && (
            <Stack direction="horizontal" gap={2}>
              <Icon className="text-mortar" src={Calendar} /> {course.courseLength}
            </Stack>
          )}
          {accessUntil && (
            <Stack direction="horizontal" gap={2} className="">
              <Icon className="text-mortar" src={AccessTimeFilled} /> Access Until: {accessUntil}
            </Stack>
          )}
        </Stack>
      </Card.Section>
      <Card.Footer className="justify-content-end">
        <Button
          as={Link}
          to={linkToCourse}
          variant="outline-primary"
        >
          Learn More
        </Button>
      </Card.Footer>
    </Card>
  );
};

const SkeletonCourseCard = (props) => (
  <SearchCourseCard {...props} isLoading />
);

SearchCourseCard.propTypes = {
  hit: PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  key: PropTypes.string,
};

SearchCourseCard.defaultProps = {
  hit: undefined,
  isLoading: false,
  key: undefined,
};

SearchCourseCard.Skeleton = SkeletonCourseCard;

export default SearchCourseCard;
