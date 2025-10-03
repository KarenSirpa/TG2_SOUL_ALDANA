import axios from "axios";
import { useState } from "react";

import loginImage from "../assets/logoSoulAldana.jpeg";

import { useNavigate } from 'react-router-dom';



export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    const iniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setMensaje('✅ Login correcto');
            navigate('/dashboard');
        } catch (error) {
            setMensaje('❌ Credenciales erróneas');
        }
    };

    return (
        <>
            {/* Estilos personalizados */}
            <style>
                {`
          .divider:after,
          .divider:before {
            content: "";
            flex: 1;
            height: 1px;
            background: #eee;
          }
        `}
            </style>

            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img src={loginImage} className="img-fluid" alt="Phone image" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1 border border-3 rounded p-4 mt-4" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                            <h2
                                className="mb-4 text-center"
                                style={{ fontFamily: "'Monserrat', sans-serif" }}
                            >
                                Login
                            </h2>

                            <form onSubmit={iniciarSesion}>
                                {/* Email input */}
                                <div className="form-outline mb-4">
                                    <input
                                        type="email"
                                        id="form1Example13"
                                        className="form-control form-control-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label className="form-label" htmlFor="form1Example13">
                                        Email address
                                    </label>
                                </div>

                                {/* Password input */}
                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        id="form1Example23"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label className="form-label" htmlFor="form1Example23">
                                        Password
                                    </label>
                                </div>

                                {/* Recordarme y olvido */}
                                <div className="d-flex justify-content-around align-items-center mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value=""
                                            id="form1Example3"
                                            defaultChecked
                                        />
                                        <label className="form-check-label" htmlFor="form1Example3">
                                            Recordarme
                                        </label>
                                    </div>
                                    <a href="#!">¿Olvidaste tu contraseña?</a>
                                </div>

                                {/* Botón de login */}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg btn-block w-100"
                                >
                                    Iniciar sesión
                                </button>
                            </form>

                            {/* Mensaje de estado */}
                            {mensaje && (
                                <div className="mt-3 alert alert-info">{mensaje}</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
