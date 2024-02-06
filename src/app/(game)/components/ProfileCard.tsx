import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BLUR_IMAGE_PATH } from '@/app/utils';
import ProfileCardContents from './ProfileCardContents';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@radix-ui/react-icons';

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSrc, name, onClick }) => {
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
            <div className="grid gap-3 px-1">
              <p className="text-nowrap md:text-lg lg:text-lg text-sm">{name}</p>
              <div className="flex items-center">
                <Button className="w-20 mr-1" onClick={onClick}>
                  <p>Update</p>
                </Button>
                <Button>
                  <StarIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs">최근 갱신: </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
