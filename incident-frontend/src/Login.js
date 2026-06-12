import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import toast from "react-hot-toast";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        onLogin();
      } else {
        toast.error("Неверный логин или пароль");
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      if (response.ok) {
        toast.success("Аккаунт успешно создан");
        setIsRegister(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">

      {/* BACKGROUND */}

      <div className="absolute w-[700px] h-[700px] rounded-full bg-violet-400/20 blur-[180px] -top-40 -left-40" />

      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-[180px] top-40 -right-40" />

      <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-400/10 blur-[180px] bottom-0 left-1/2" />

      {/* CARD */}

      <div
        className="
          relative
          z-10
          max-w-md
          w-full
          bg-white/60
          backdrop-blur-3xl
          border
          border-white/50
          rounded-[32px]
          shadow-[0_20px_60px_rgba(99,102,241,0.15)]
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-center">

          <div
            className="
              w-20
              h-20
              mx-auto
              mb-6
              rounded-3xl
              bg-white/10
              backdrop-blur-xl
              flex
              items-center
              justify-center
            "
          >
            <ShieldAlert
              size={40}
              color="white"
            />
          </div>

          <h1 className="text-5xl font-bold text-white">
            Incident AI
          </h1>

          <p className="text-xl text-white/80 mt-3">
            Analytics Platform
          </p>

          <p className="text-sm text-white/60 mt-2">
            AI-powered incident monitoring and risk assessment
          </p>

        </div>
        <div className="p-8">
          <form
            onSubmit={
              isRegister
                ? handleRegister
                : handleSubmit
            }
            className="space-y-6"
          >
            {isRegister && (

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-white/70
                    border
                    border-white/60
                    backdrop-blur-xl
                  "
                  placeholder="Иван Иванов"
                  required
                />

              </div>

            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  px-5
                  py-4
                  rounded-2xl
                  bg-white/70
                  border
                  border-white/60
                  backdrop-blur-xl
                  focus:ring-2
                  focus:ring-violet-500
                  outline-none
                "
                placeholder="ivan@company.ru"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {
                loading
                  ? 'Загрузка...'
                  : isRegister
                    ? 'Создать аккаунт'
                    : 'Войти в систему'
              }
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="
              w-full
              mt-4
              text-violet-600
              font-medium
              hover:text-violet-700
            "
          >
            {
              isRegister
                ? "Уже есть аккаунт? Войти"
                : "Нет аккаунта? Зарегистрироваться"
            }
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            Демо доступ: admin@admin.com / ваш_пароль
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;