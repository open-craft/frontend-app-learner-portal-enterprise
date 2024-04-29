import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  Badge,
  Icon,
} from '@edx/paragon';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { AccessTimeFilled, School } from '@edx/paragon/icons';

import { CourseContext } from '../CourseContextProvider';
import CourseSkills from '../CourseSkills';
import CourseEnrollmentFailedAlert, { ENROLLMENT_SOURCE } from '../CourseEnrollmentFailedAlert';
import CourseRunCards from './CourseRunCards';

import {
  getDefaultProgram,
  formatProgramType,
  findUserEnrollmentForCourseRun,
} from '../data/utils';
import { useCoursePartners, useIsCourseAssigned } from '../data/hooks';
import LicenseRequestedAlert from '../LicenseRequestedAlert';
import SubsidyRequestButton from '../SubsidyRequestButton';
import CourseReview from '../CourseReview';

import CoursePreview from './CoursePreview';
import { UserSubsidyContext } from '../../enterprise-user-subsidy';
import { features } from '../../../config';
import FullChip from '../../search/FullChip';

const CourseHeader = () => {
  const { enterpriseConfig } = useContext(AppContext);
  const {
    state: {
      course,
      catalog,
      userEnrollments,
    },
    isPolicyRedemptionEnabled,
  } = useContext(CourseContext);
  const {
    redeemableLearnerCreditPolicies,
    subscriptionPlan,
  } = useContext(UserSubsidyContext);
  const isCourseAssigned = useIsCourseAssigned(redeemableLearnerCreditPolicies, course?.key);

  const [partners] = useCoursePartners(course);

  const defaultProgram = useMemo(
    () => getDefaultProgram(course.programs),
    [course],
  );

  const accessUntil = subscriptionPlan
    ? new Date(subscriptionPlan.expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const isEnrolled = course.courseRuns.reduce(
    (acc, courserun) => findUserEnrollmentForCourseRun({
      userEnrollments,
      key: courserun.key,
    }) || acc,
    false,
  );

  return (
    <div className="course-header">
      <LicenseRequestedAlert catalogList={catalog.catalogList} />
      <CourseEnrollmentFailedAlert enrollmentSource={ENROLLMENT_SOURCE.COURSE_PAGE} />
      <Container size="lg">
        <Row>
          {!enterpriseConfig.disableSearch && (
            <div className="small mt-4 col-12">
              <Breadcrumb
                links={[
                  {
                    label: 'Course Finder',
                    to: `/${enterpriseConfig.slug}/search`,
                  },
                ]}
                activeLabel={course.title}
                linkAs={Link}
              />
            </div>
          )}
        </Row>
        <Row className="mb-4">
          <Col xs={12} md={{ span: 5 }} className="my-3 mt-lg-0">
            <CoursePreview
              previewImage={course?.image?.src || course?.video?.image}
              previewVideoURL={course?.video?.src}
              partnerLogoUrl={partners.length ? partners[0].logoImageUrl : null}
            />
          </Col>
          <Col xs={12} md={7} className="d-flex flex-column justify-content-center">
            <div className="mb-4">
              <FullChip icon={School} accent="mortar" text="COURSE" />
              { isEnrolled && (<FullChip icon={School} accent="green" text="Enrolled" />) }
            </div>
            <div className={classNames({ 'mb-4': !course.shortDescription, 'd-flex': true, 'align-items-center': true })}>
              <h2>{course.title}</h2>
              {(features.FEATURE_ENABLE_TOP_DOWN_ASSIGNMENT && isCourseAssigned) && <Badge variant="info" className="ml-4">Assigned</Badge>}
            </div>
            {course.shortDescription && (
              <div
                className="lead font-weight-normal mb-4"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: course.shortDescription }}
              />
            )}
            <p className="mb-4">
              <strong><Icon src={AccessTimeFilled} class="d-inline" /> Access Until: </strong> {accessUntil}
            </p>
            {course.skills?.length > 0 && <CourseSkills />}
            {isPolicyRedemptionEnabled && <CourseRunCards />}
            {catalog.containsContentItems && (
              <>
                {!isPolicyRedemptionEnabled && <CourseRunCards />}
                <SubsidyRequestButton />
              </>
            )}
          </Col>
        </Row>
        {/*
        <Row>
          <Col xs={12} lg={12}>
            {catalog.containsContentItems ? (
              <>
                <CourseReview />
                {defaultProgram && (
                  <p className="font-weight-bold mt-3 mb-0">
                    This course is part of a {formatProgramType(defaultProgram.type)}.
                  </p>
                )}
              </>
            ) : (
              <p className="font-weight-bold mt-3 mb-0">
                This course is not part of your company&apos;s curated course catalog.
              </p>
            )}
          </Col>
        </Row>
        */}
      </Container>
    </div>
  );
};

export default CourseHeader;
