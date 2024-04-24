import React from 'react';
import { Container, Row } from '@edx/paragon';

import CourseHeader from '../course-header/CourseHeader';
import CourseMainContent from '../CourseMainContent';

const CourseAbout = () => (
  <>
    <CourseHeader />
    <Container size="lg" className="py-5">
      <Row>
        <CourseMainContent />
      </Row>
    </Container>
  </>
);

export default CourseAbout;
