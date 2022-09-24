import { useState, useEffect } from "react";

import { useFetch } from "../../hooks/useFetch";

import "./AuthPage.scss";

export const AuthPage = () => {
    const { isLoading, error, request, clearErrors } = useFetch();
    const [nickname, setNickname] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [registerNewUser, setRegisterNewUser] = useState(false);
    const [token, setToken] = useState(null);

    const registerHandler = async () => {
        try {
            const data = await request("/api/auth/register", "POST", {
                nickname,
                email,
                password,
            });

            data && window.alert(data.message);
        } catch (error) {}
    };

    const loginHandler = async () => {
        try {
            const data = await request("/api/auth/login", "POST", {
                email,
                password,
            });
            const { token } = data;

            setToken(token);
        } catch (error) {}
    };

    useEffect(() => {
        error && window.alert(error);

        return clearErrors();
    }, [error, clearErrors]);

    return (
        <>
            {!token ? (
                <form action="" method="post" className="auth-form">
                    <ul className="tab-list">
                        <li
                            className="tab-item"
                            onClick={() => setRegisterNewUser(true)}
                        >
                            Registration
                        </li>
                        <li
                            className="tab-item"
                            onClick={() => setRegisterNewUser(false)}
                        >
                            Login
                        </li>
                    </ul>

                    {registerNewUser && (
                        <>
                            <label htmlFor="nickname">Name</label>
                            <input
                                id="nickname"
                                type="text"
                                name="nickname"
                                onChange={(e) => setNickname(e.target.value)}
                                required
                            ></input>
                        </>
                    )}

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></input>

                    {registerNewUser && (
                        <>
                            <input
                                type="button"
                                value="Register"
                                onClick={registerHandler}
                                disabled={isLoading}
                            ></input>
                        </>
                    )}

                    {!registerNewUser && (
                        <>
                            <input
                                type="submit"
                                value="Login"
                                onClick={loginHandler}
                                disabled={isLoading}
                            ></input>
                        </>
                    )}
                </form>
            ) : (
                <button onClick={() => setToken(null)}>Logout</button>
            )}
        </>
    );
};
