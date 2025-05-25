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
      title: 'Hokusai',
      logo: {
        alt: 'Hokusai',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      style: 'primary',
      items: [
        {
          href: 'https://hokus.ai/data-suppliers',
          label: 'Data Suppliers',
          position: 'right',
        },
        {
          href: 'https://hokus.ai/ai-developers',
          label: 'AI Developers',
          position: 'right',
        },
        {
          href: 'https://hokus.ai/explore-models',
          label: 'Explore Models',
          position: 'right',
        },
        {
          to: '/',
          label: 'Docs',
          position: 'right',
        },
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
            { label: 'GitHub', href: 'https://github.com/Hokusai-protocol/hokusai-docs/' },
          ],
        },
      ],
    },
  },
};