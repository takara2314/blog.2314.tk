const withExportImages = require('next-export-optimize-images');

const config = withExportImages({
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
});

// const config = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname:
//           'prod-files-secure.s3.us-west-2.amazonaws.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

module.exports = config;
