import type { Metadata } from 'next';
import { decodeSearchParams } from '@/app/utils';
import { PageProps } from '../intrefaces/intreface';

export async function generateProfileMetadata({ params }: PageProps): Promise<Metadata> {
  const [region, user] = decodeSearchParams(params.slug);

  return {
    title: `${region.toUpperCase()} ${user}의 프로필`,
    description: `${region}지역 ${user}의 최근 프로필 조회 정보입니다.`,
  };
}
