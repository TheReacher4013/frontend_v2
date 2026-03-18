import React from "react";

function User() {
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@gmail.com",
      role: "Admin",
    },
    {
      id: 2,
      name: "Manager User",
      email: "manager@gmail.com",
      role: "Manager",
    },
    {
      id: 3,
      name: "Member User",
      email: "member@gmail.com",
      role: "Member",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">User List</h1>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;