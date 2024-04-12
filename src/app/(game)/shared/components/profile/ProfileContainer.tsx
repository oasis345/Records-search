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
    <div className="container flex flex-col">
      <ProfileCard user={user} />
      {children}
    </div>
  );
}
