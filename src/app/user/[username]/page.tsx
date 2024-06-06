import { getUserByUsername } from '@/utils/firebaseUtils'; // Adjust the import based on your file structure
import { notFound } from 'next/navigation';

type UserPageProps = {
  params: {
    username: string;
  };
};

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  console.log(user);

  return (
    <div>
      <h1>Page</h1>
      <p>ID: {user.id}</p>
      {/* Display other user data as needed */}
    </div>
  );
};

export default UserPage;
