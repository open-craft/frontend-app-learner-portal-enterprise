import React, { useContext } from 'react';
// import { AppContext } from '@edx/frontend-platform/react';
import { Col } from '@edx/paragon';

import { CourseContext } from './CourseContextProvider';
// import CreatedBy from './CreatedBy';
// import VerifiedCertPitch from './VerifiedCertPitch';

function formatSponsorTextList(sponsors) {
  const names = sponsors.map(sponsor => sponsor.name);
  let sponsorTextList;

  if (names.length === 1) {
    [sponsorTextList] = names;
  }

  if (names.length === 2) {
    sponsorTextList = names.join(' and ');
  }

  if (names.length > 2) {
    const lastName = names.pop();
    sponsorTextList = `${names.join(', ')}, and ${lastName}`;
  }

  return sponsorTextList;
}

const CourseMainContent = () => {
  // const { config } = useContext(AppContext);
  const { state } = useContext(CourseContext);
  const { course, activeCourseRun } = state;

  return (
    <Col>
      {course.fullDescription && (
        <div className="mb-5">
          <h2>About</h2>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: course.fullDescription }} />
        </div>
      )}
      {course.outcome && (
        <div className="mb-5">
          <h2>What you&apos;ll learn</h2>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: course.outcome }} />
        </div>
      )}
      {course.syllabusRaw && (
        <div className="mb-5">
          <h2>Syllabus</h2>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: course.syllabusRaw }} />
        </div>
      )}
      {/*
      <CreatedBy />
      */}
      {/*
        activeCourseRun.type === 'verified' && (
          <VerifiedCertPitch />
        )
      */}
      {
        course.learnerTestimonials && (
          <div className="mb-5">
            <h3>Learner testimonials</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: course.learnerTestimonials }} />
          </div>
        )
      }
      {
        course.faq && (
          <div className="mb-5">
            <h3>Frequently asked questions</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: course.faq }} />
          </div>
        )
      }
      {
        course.additionalInformation && (
          <div className="mb-5">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: course.additionalInformation }} />
          </div>
        )
      }
      {
        activeCourseRun.hasOfacRestrictions && (
          <div className="mb-5">
            <h3>Who can take this course?</h3>
            <p>
              Unfortunately, learners from one or more of the following countries or regions will not
              be able to register for this course: Iran, Cuba and the Crimea region of Ukraine.
              While edX has sought licenses from the U.S. Office of Foreign Assets Control (OFAC) to
              offer our courses to learners in these countries and regions, the licenses we have
              received are not broad enough to allow us to offer this course in all locations. EdX
              truly regrets that U.S. sanctions prevent us from offering all of our courses to
              everyone, no matter where they live.
            </p>
          </div>
        )
      }
    </Col>
  );
};

export default CourseMainContent;
