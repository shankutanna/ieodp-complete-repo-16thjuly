import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../registerSchema";

const RegisterForm = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        console.log("Register Payload:", data);

        // 👉 Here you will call backend API later
        // For now, just redirect to login
        alert("Registration successful! Please login.");
        navigate("/login");
    };

    return (
        <div className="flex rounded-md items-center justify-center ">
            <div className="card w-full max-w-xl bg-base-300 p-4 ">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-x-4 md:space-y-4 grid md:grid-cols-2">
                    {/* FIRST NAME */}
                    <div>
                        <label className="label">
                            <span className="label-text">First Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            className="input input-bordered w-full"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-error text-sm">{errors.firstName.message}</p>
                        )}
                    </div>

                    {/* LAST NAME */}
                    <div>
                        <label className="label">
                            <span className="label-text">Last Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            className="input input-bordered w-full"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-error text-sm">{errors.lastName.message}</p>
                        )}
                    </div>

                    {/* USERNAME */}
                    <div>
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            className="input input-bordered w-full"
                            {...register("username")}
                        />
                        {errors.username && (
                            <p className="text-error text-sm">{errors.username.message}</p>
                        )}
                    </div>

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
                            <p className="text-error text-sm">{errors.email.message}</p>
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
                        {errors.password && (
                            <p className="text-error text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* MOBILE NUMBER */}
                    <div>
                        <label className="label">
                            <span className="label-text">Mobile Number</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="10-digit mobile number"
                            className="input input-bordered w-full"
                            {...register("mobileNumber")}
                        />
                        {errors.mobileNumber && (
                            <p className="text-error text-sm">
                                {errors.mobileNumber.message}
                            </p>
                        )}
                    </div>

                    {/* GENDER */}
                    <div>
                        <label className="label">
                            <span className="label-text">Gender</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            {...register("gender")}
                        >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-error text-sm">{errors.gender.message}</p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>

                    {/* LOGIN LINK */}
                    <div className="text-center mt-3">
                        <span className="text-sm">
                            Already have an account?{" "}
                            <span
                                className="link link-primary cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </span>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
