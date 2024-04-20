import React from 'react';
import TitleBanner from '../shared/components/TitleBanner';
import { regions } from './model/regions';

export default async function Page() {
  return (
    <TitleBanner
      selectItems={regions}
      selectedItem={'pc-kakao'}
      keyField="name"
      labelField="label"
      placeholder="대소문자 구분 포함"
    />
  );
}
