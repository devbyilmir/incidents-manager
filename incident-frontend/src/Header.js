import React from 'react';

const Header = ({ user, onLogout, onCreateIncident }) => {
  return (
    <header className="
      sticky
      top-0
      z-50
      backdrop-blur-xl
      bg-white/70
      border-b
      border-white/40
    ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Левая часть */}
          <div className="flex items-center">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-gradient-to-br
                  from-red-500
                  to-orange-500
                  flex
                  items-center
                  justify-center
                  text-white
                  shadow-lg
                "
              >
                🚨
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Incident AI
                </h1>

                <p className="text-xs text-gray-500">
                  Incident Analytics Platform
                </p>
              </div>

            </div>

            {/* Навигация */}
            <nav
              className="
                ml-10
                flex
                items-center
                gap-2
                bg-white/60
                backdrop-blur-xl
                rounded-2xl
                p-2
                border
                border-white/50
                shadow-sm
              "
            >
              <a
                href="#incidents"
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white
                  shadow-sm
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                Инциденты
              </a>

              <button
                onClick={onCreateIncident}
                className="
                  px-4
                  py-2
                  rounded-xl
                  text-gray-600
                  hover:bg-white
                  hover:shadow-sm
                  transition-all
                  duration-200
                "
              >
                Создать инцидент
              </button>
            </nav>

          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-4">

            {user && (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-800">
                    Привет, {user.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    Авторизованный пользователь
                  </span>
                </div>

                <span
                  className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-500
                    to-purple-600
                    text-white
                    text-xs
                    font-semibold
                    shadow-md
                  "
                >
                  {user.role}
                </span>

                <button
                  onClick={onLogout}
                  className="
                    bg-white/80
                    backdrop-blur-xl
                    border
                    border-white/50
                    hover:shadow-lg
                    px-4
                    py-2
                    rounded-2xl
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                  "
                >
                  Выйти
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;