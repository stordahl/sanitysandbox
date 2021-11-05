export default {
  name: 'disallowedWord',
  title: 'Disallowed word',
  type: 'document',
  fields: [
    {
      name: 'words',
      title: 'Words',
      type: 'array',
      of: [{type: 'string'}]
    },    
  ],
}