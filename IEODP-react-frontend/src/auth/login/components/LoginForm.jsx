import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '../loginSchema';
import { setCredentials } from '../../authSlice';
import { ROLES } from '../../../utils/roles';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data) => {
        const mockResponse = {
            user: {
                id: 1,
                name: "Enterprise User",
                email: data.email,
                role: data.role,
            },
            token: "fake-jwt-token",
        };

        dispatch(setCredentials(mockResponse));

        if (data.role === ROLES.OPERATIONS) navigate("/operations/dashboard");
        if (data.role === ROLES.MANAGEMENT) navigate("/management/dashboard");
        if (data.role === ROLES.LEADERSHIP) navigate("/leadership/dashboard");
        if (data.role === ROLES.AUDITORS) navigate("/auditors/dashboard");
        if (data.role === ROLES.ADMIN) navigate("/admin/dashboard");
    };
  return (
      <div>  <div className="card w-96 bg-base-300 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">IEODP Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* EMAIL */}
              <div>
                  <label className="label">
                      <span className="label-text">Email</span>
                  </label>
                  <input
                      type="email"
                      placeholder="user@corp.com"
                      className="input input-bordered w-full"
                      {...register("email")}
                  />
                  {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
                  )}
              </div>

              {/* PASSWORD */}
              <div>
                  <label className="label">
                      <span className="label-text">Password</span>
                  </label>
                  <input
                      type="password"
                      placeholder="Enter password"
                      className="input input-bordered w-full"
                      {...register("password")}
                  />
                  <span>
                      <Link to='/rest-password' className="link">rest Password</Link>
                  </span>
                  {errors.password && (
                      <p className="text-error text-sm mt-1">
                          {errors.password.message}
                      </p>
                  )}
              </div>

              {/* ROLE SELECT */}
              <div>
                  <label className="label">
                      <span className="label-text">Role</span>
                  </label>
                  <select
                      className="select select-bordered w-full"
                      {...register("role")}
                  >
                      <option value="">Select role</option>
                      <option value={ROLES.OPERATIONS}>Operations</option>
                      <option value={ROLES.MANAGEMENT}>Management</option>
                      <option value={ROLES.LEADERSHIP}>Leadership</option>
                      <option value={ROLES.AUDITORS}>Auditor</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                  {errors.role && (
                      <p className="text-error text-sm mt-1">{errors.role.message}</p>
                  )}
              </div>

              {/* SUBMIT */}
              <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
              >
                  {isSubmitting ? "Logging in..." : "Login"}
              </button>

          </form>
          <div className="m-2">Create a new account? <Link to='/register' className="link">Register</Link> </div>
      </div></div>
  )
}

export default LoginForm