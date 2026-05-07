import React from 'react';
import Navbar from '@theme-original/Navbar';
type Props = Record<string, never>;

export default function NavbarWrapper(props: Props): React.ReactElement {
  return (
    <>
      <Navbar {...props} />
    </>
  );
}
