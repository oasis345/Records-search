import { regions } from '../model/regions';
import React, { useEffect } from 'react';
import TitleHome from '../TitleHome';

export default function Page() {
  return <TitleHome selectItems={regions} selectedItem={'kr'} keyField="name" labelField="label" />;
}
