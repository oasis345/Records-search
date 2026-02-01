import NotFoundUser from '@/app/(game)/shared/components/error/NotFoundUser';
import ProfileCard from '@/app/(game)/shared/components/profile/ProfileCard';
import { User } from '../../model/user';

export default async function ProfileContainer({
  region,
  searchText,
  user,
  children,
}: {
  region: string;
  searchText: string;
  user?: User;
  children?: React.ReactNode;
}) {
  return !user ? (
    <NotFoundUser region={region} searchText={searchText} />
  ) : (
    <div className="container py-6 px-4">
      <div className="flex flex-col gap-6">
        <ProfileCard user={user} />
        {children}
      </div>
    </div>
  );
}
