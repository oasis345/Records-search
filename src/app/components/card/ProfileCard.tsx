'use client';
import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileCardProps {
  imageSrc: string;
  name: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSrc, name }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex">
            <Image width={120} height={120} src={imageSrc} alt="Profile Image" priority />
            <div>{name}</div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
