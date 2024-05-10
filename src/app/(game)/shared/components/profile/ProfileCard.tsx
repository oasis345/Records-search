import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCardContents from './ProfileCardContents';
import { User } from '../../model/user';

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex">
            <div className="border-blue-300 border">
              <Image width={120} height={120} src={user.profileIcon ?? '/profile.jpg'} alt="Profile Image" priority />
            </div>
            <div className="px-5">
              <p className="text-nowrap md:text-lg lg:text-lg text-sm pb-3">
                <span>{user.name}</span> &nbsp;
                <span>{user.tag}</span> &nbsp;
                <span>{user.region.toUpperCase()}</span>
              </p>
              <ProfileCardContents user={user} />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
