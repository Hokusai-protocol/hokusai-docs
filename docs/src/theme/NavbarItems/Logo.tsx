import React from 'react';
import type { FC } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Logo: FC = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Link to="/" className="navbar__brand flex items-center group">
      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-2 transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 18C3 18 4.5 15 6 15C7.5 15 9 18 9 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 18C9 18 10.5 15 12 15C13.5 15 15 18 15 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 18C15 18 16.5 15 18 15C19.5 15 21 18 21 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 9C3 9 7.5 4 12 4C16.5 4 21 9 21 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xl font-bold text-blue-900 dark:text-white transition-colors">
        {siteConfig.title}
      </span>
    </Link>
  );
};

export default Logo;
