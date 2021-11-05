import client from 'part:@sanity/base/client';
import groq from 'groq';

const isUniqueDept = (dept, context) => {
  const { document } = context;

  const id = document._id.replace(/^drafts\./, '');

  const params = {
    draft: `drafts.${id}`,
    published: id,
    dept,
  };

  /* groq */
  const query = groq`!defined(*[
    _type == 'department' &&
    !(_id in [$draft, $published]) &&
    name == $dept
  ][0]._id)`;

  return client.fetch(query, params);
};

export default {
  name: 'department',
  title: 'Department',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const isUnique = await isUniqueDept(value, context);
          if (!isUnique) return 'Dept is not unique';
          return true;
        }),
    },
  ],
}