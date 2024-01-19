import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProfileCardProps {
  imageSrc: string;
  name: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSrc, name }) => {
  return (
    <Card>
      <div className="flex">
        <Image width={120} height={120} src={imageSrc} alt="Profile Image" />
        {name}
        <Button>전적갱신</Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
