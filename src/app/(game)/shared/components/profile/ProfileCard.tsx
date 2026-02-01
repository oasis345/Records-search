import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ProfileCardContents from './ProfileCardContents';
import { User } from '../../model/user';
import { MapPin, User as UserIcon } from 'lucide-react';

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Profile Image Section */}
          <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-primary/20">
                <Image
                  width={128}
                  height={128}
                  src={user.profileIcon ?? '/profile.jpg'}
                  alt="Profile Image"
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Level Badge */}
              {user.data?.summonerLevel && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Lv. {user.data.summonerLevel}
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
            {/* Name and Tag */}
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                <span>{user.name}</span>
                {user.tag && (
                  <span className="text-lg text-muted-foreground font-normal">#{user.tag}</span>
                )}
              </h2>

              {/* Region Badge */}
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.region?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <ProfileCardContents user={user} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
