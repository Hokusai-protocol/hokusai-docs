const config = {
  title: 'Hokusai Protocol',
  tagline: 'Documentation for Hokusai Protocol',
  favicon: 'img/favicon.ico',
  url: 'https://docs.hokusai.io',
  baseUrl: '/',
  organizationName: 'hokusai-protocol',
  projectName: 'hokusai-docs',

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/hokusai-protocol/hokusai-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/hokusai-protocol/hokusai-docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Hokusai Protocol',
      logo: {
        alt: 'Hokusai Protocol Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/hokusai-protocol/hokusai-docs',
          label: 'GitHub',
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
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/hokusai',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/hokusai_protocol',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/hokusai-protocol/hokusai-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hokusai Protocol. Built with Docusaurus.`,
    },
  },
};

module.exports = config;
