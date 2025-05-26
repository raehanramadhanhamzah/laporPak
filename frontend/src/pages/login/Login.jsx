// src/pages/login/Login.jsx
import "../../index.css";

// export default function Login({ form, onChange, onSubmit }) {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//       <form
//         onSubmit={onSubmit}
//         className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={onChange}
//           className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={onChange}
//           className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

export default function Login({ form, onChange, onSubmit }) {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <p className="auth-footer-text">
          Don't have an account?{" "}
          <a href="/register" className="auth-footer-link">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}