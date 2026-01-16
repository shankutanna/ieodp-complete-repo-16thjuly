import { useGetUsersQuery } from "../../userApi";
import UserRow from "../components/UserRow";


const AdminUsersPage = () => {
    const { data: users = [], isLoading } = useGetUsersQuery();

    if (isLoading) {
        return <div className="loading loading-spinner loading-lg" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            <div className="overflow-x-auto bg-base-200 rounded-lg shadow">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center text-base-content/60 mt-6">
                    No users found
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
