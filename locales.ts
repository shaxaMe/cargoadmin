export default [
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'ru',
      name: 'Русский',
    },
    {
      code: 'uz',
      name: 'Uzbek',
    },
  ].map(lang => ({ file: lang.code + '.json', ...lang }))