import { Form } from '@edx/paragon';

const CourseEnrollmentsFilter = ({ groups, current, selectGroup }) => (
  <Form.Group className="mt-5">
    <Form.Label className="font-weight-bold mb-4">Status</Form.Label>
    <Form.RadioSet
      name="colors"
      onChange={e => selectGroup(e.target.value)}
      value={current}
    >
      {groups.map(g => <Form.Radio key={g} value={g}>{g}</Form.Radio>)}
    </Form.RadioSet>
  </Form.Group>
);

export default CourseEnrollmentsFilter;
