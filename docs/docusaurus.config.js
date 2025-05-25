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
      style: 'primary',
      items: [
        {
          to: 'https://hokus.ai/data-suppliers',
          label: 'Data Suppliers',
          position: 'left',
        },
        {
          to: 'https://hokus.ai/ai-developers',
          label: 'AI Developers',
          position: 'left',
        },
        {
          to: 'https://hokus.ai/explore-models',
          label: 'Explore Models',
          position: 'left',
        },
        {
          to: 'https://docs.hokus.ai',
          label: 'Docs',
          position: 'left',
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