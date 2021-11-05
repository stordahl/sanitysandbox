import client from 'part:@sanity/base/client';
import groq from 'groq';

const hasBadWords = async (post, context) => {
  const { document } = context;

  const id = document._id.replace(/^drafts\./, '');

  /* groq */
  const query = groq`*[_type == 'disallowedWord'][0]`;

  const { words } = await client.fetch(query);

  for (const block of post){
    for (const child of block.children){
      if (words.some(child.text.includes.bind(child.text.toLowerCase()))) {
        return false
      } else {
        return true
      }
    }
  }

};

export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const isClean = await hasBadWords(value, context);
          if (!isClean) return 'Contains words that are not allowed';
          return true;
        }),
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}
