export default [
  {
    path: 'search',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/search/Search'))
      // })
    },
  },
  {
    path: 'find',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/search/Find'))
      // })
    },
  },
]
