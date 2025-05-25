// src/pages/register/Register.jsx
import "../../index.css";

// export default function Register({ form, onChange, onSubmit }) {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//       <form
//         onSubmit={onSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

//         <input
//           name="name"
//           type="text"
//           placeholder="Nama Lengkap"
//           value={form.name}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//           required
//         />

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//           required
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//           required
//         />

//         <input
//           name="phone"
//           type="text"
//           placeholder="Nomor Telepon"
//           value={form.phone}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//           required
//         />

//         <input
//           name="address"
//           type="text"
//           placeholder="Alamat"
//           value={form.address}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//           required
//         />

//         <select
//           name="role"
//           value={form.role}
//           onChange={onChange}
//           className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           <option value="pelapor">Pelapor</option>
//           <option value="petugas">Petugas</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

export default function Register({ form, onChange, onSubmit }) {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2>Register</h2>
        <input
          name="name"
          type="text"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Nomor Telepon"
          value={form.phone}
          onChange={onChange}
          required
        />
        <input
          name="address"
          type="text"
          placeholder="Alamat"
          value={form.address}
          onChange={onChange}
          required
        />
        <button type="submit">Register</button>
        <p className="auth-footer-text">
          Already have an account?{" "}
          <a href="/login" className="auth-footer-link">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}