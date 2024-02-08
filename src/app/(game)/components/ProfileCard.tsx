import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BLUR_IMAGE_PATH } from '@/app/utils';
import ProfileCardContents from './ProfileCardContents';

const ProfileCard = ({
  imageSrc,
  region,
  name,
  tag,
}: {
  imageSrc: string;
  name: string;
  region: string;
  tag: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex">
            <Image
              width={120}
              height={120}
              style={{ height: '120px' }}
              src={imageSrc}
              alt="Profile Image"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
            <div className="px-5">
              <p className="text-nowrap md:text-lg lg:text-lg text-sm pb-3">
                <span>{name}</span>
                <span>#{tag}</span> &nbsp;
                <span>{region?.toUpperCase()}</span>
              </p>
              <ProfileCardContents name={name} region={region} tag={tag} />
              {/* <p className="text-xs">최근 갱신: </p> */}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
