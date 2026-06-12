import React from "react";

export default function DeleteIncidentModal({
  isOpen,
  onClose,
  onConfirm
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/30
        backdrop-blur-md
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white/80
          backdrop-blur-2xl
          rounded-3xl
          p-6
          w-[420px]
          border
          border-white/50
        "
      >
        <h2 className="text-xl font-bold">
          Удалить инцидент?
        </h2>

        <p className="mt-3 text-slate-500">
          Это действие нельзя отменить.
        </p>

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
              rounded-2xl
              bg-slate-100
            "
          >
            Отмена
          </button>

          <button
            onClick={onConfirm}
            className="
              flex-1
              py-3
              rounded-2xl
              bg-red-500
              text-white
            "
          >
            Удалить
          </button>

        </div>

      </div>

    </div>
  );
}