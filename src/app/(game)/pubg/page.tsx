import React from 'react';
import TitleBanner from '../shared/components/TitleBanner';
import { searchRegions } from './model/regions';

export default async function Page() {
  return (
    <TitleBanner
      selectItems={searchRegions}
      selectedItem={'kakao'}
      keyField="name"
      labelField="label"
      placeholder="대소문자 구분 포함"
    />
  );
}
