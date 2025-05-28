module.exports = {
  title: 'Hokusai Docs',
  url: 'https://docs.hokus.ai',
  baseUrl: '/',
  organizationName: 'Hokusai-protocol',
  projectName: 'hokusai-docs',
  favicon: 'img/favicon.ico',

  // Add presets configuration
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
        },
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
          to: '/',
          label: 'Docs',
          position: 'left',
          activeBaseRegex: '^/$|^/(?!api|community|blog)',
        },
        {
          to: '/api-reference',
          label: 'API',
          position: 'left',
        },
        {
          to: '/community',
          label: 'Community',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://hokus.ai',
          label: 'Back to Main Site',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'API Reference', to: '/api-reference' },
            { label: 'Tokenomics', to: '/tokenomics' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/Hokusai-protocol/hokusai-docs/' },
            { label: 'Discord', href: 'https://discord.gg/hokusai' },
            { label: 'Twitter', href: 'https://twitter.com/hokusai_protocol' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: '/blog' },
            { label: 'Main Site', href: 'https://hokus.ai' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hokusai Protocol. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
  ],

  markdown: {
    mermaid: true,
  },
};