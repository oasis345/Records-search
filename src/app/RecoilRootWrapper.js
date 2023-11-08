'use client';

import { RecoilRoot } from 'recoil';

function RecoilRootWrapper({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

export default RecoilRootWrapper;
