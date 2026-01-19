

import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../userApi";
import { ROLES } from "../../../utils/roles";

const UserRow = ({ user }) => {
    const [updateUser] = useUpdateUserMutation();

    const handleRoleChange = async (e) => {
        await updateUser({
            id: user.id,
            data: { role: e.target.value },
        });
        toast.success("Role updated");
    };

    const handleStatusChange = async (e) => {
        await updateUser({
            id: user.id,
            data: { status: e.target.value },
        });
        toast.success("Status updated");
    };

    return (
        <tr>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>

            {/* ROLE */}
            <td>
                <select
                    className="select select-bordered select-sm"
                    value={user.role}
                    onChange={handleRoleChange}
                >
                    <option value={ROLES.OPERATIONS}>Operations</option>
                    <option value={ROLES.MANAGEMENT}>Management</option>
                    <option value={ROLES.LEADERSHIP}>Leadership</option>
                    <option value={ROLES.AUDITORS}>Auditor</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                </select>
            </td>

            {/* STATUS */}
            <td>
                <select
                    className="select select-bordered select-sm"
                    value={user.status}
                    onChange={handleStatusChange}
                >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>
            </td>
        </tr>
    );
};

export default UserRow;
