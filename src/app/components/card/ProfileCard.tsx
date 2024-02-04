import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BLUR_IMAGE_PATH } from '@/app/utils';

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSrc, name }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex">
            <Image
              width={120}
              height={120}
              src={imageSrc}
              alt="Profile Image"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
            <p className="mx-5">{name}</p>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
