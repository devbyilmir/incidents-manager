import React from 'react';
import { ShieldAlert } from "lucide-react";

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
                <ShieldAlert size={18} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Incident AI
                </h1>

                <p className="text-xs text-gray-500">
                  AI-Powered Analytics Platform
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
                bg-white/40
                backdrop-blur-xl
                rounded-2xl
                p-2
                border
                border-white/50
                shadow-sm
                shadow-lg
                shadow-slate-200/50
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
                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-br
                      from-violet-500
                      to-blue-500
                      text-white
                      flex
                      items-center
                      justify-center
                      font-semibold
                      shadow-lg
                    "
                  >
                    {user.name?.charAt(0)}
                  </div>

                  <div className="flex flex-col">

                    <span className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </span>

                    <span className="text-xs text-slate-500">
                      {user.role === 'admin'
                        ? 'Администратор системы'
                        : user.role === 'master'
                        ? 'Ответственный специалист'
                        : 'Оператор'}
                    </span>

                  </div>

                </div>

                {/* <span
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
                </span> */}

                <button
                  onClick={onLogout}
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white/50
                  backdrop-blur-xl
                  border
                  border-white/50
                  hover:bg-white
                  hover:shadow-lg
                  transition-all
                  "
                >
                  ↗
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