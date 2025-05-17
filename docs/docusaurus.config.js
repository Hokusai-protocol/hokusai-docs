module.exports = {
  title: 'Hokusai Docs',
  url: 'https://docs.hokus.ai',
  baseUrl: '/',
  favicon: 'img/favicon.ico',

  // Add presets configuration
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
      type: 'text/css',
    },
  ],

  themeConfig: {
    navbar: {
      title: 'Hokusai Docs',
      logo: {
        alt: 'Hokusai Logo',
        src: 'img/logo-light.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        { to: '/', label: 'Home', position: 'left' },
        { href: 'https://hokus.ai', label: 'Main Site', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/your-repo' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Hokusai`,
    },
  },
};