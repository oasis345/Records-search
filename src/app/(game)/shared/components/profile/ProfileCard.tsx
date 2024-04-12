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
            <Image width={120} height={120} style={{ height: '120px' }} src={user.profileIcon} alt="Profile Image" />
            <div className="px-5">
              <p className="text-nowrap md:text-lg lg:text-lg text-sm pb-3">
                <span>{user.name}</span>
                <span>#{user.tag}</span> &nbsp;
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
