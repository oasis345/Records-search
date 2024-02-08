import { regions } from '../lol/model/regions';
import React from 'react';
import TitleBanner from '../TitleBanner';

export default function Page() {
  return <TitleBanner selectItems={regions} selectedItem={'kr'} keyField="name" labelField="label" />;
}
