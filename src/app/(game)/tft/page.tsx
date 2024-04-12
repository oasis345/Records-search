import { regions } from '../shared/model/riot/regions';
import React from 'react';
import TitleBanner from '../shared/components/TitleBanner';

export default function Page() {
  return <TitleBanner selectItems={regions} selectedItem={'kr'} keyField="name" labelField="label" />;
}
