import React from "react";
import { Button } from "./Button";

export function WarrantModal({ isOpen, onClose, title, children}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>
      <div
        className="inline-block bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all max-w-2xl hover:shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
          <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4" id="modal-headline">
            {title}
          </h3>

          <Button
            className="absolute top-4 right-4 text-gray-500 hover:text-white focus:outline-none"
            handleClick={onClose}
            type="button"
            autoFocus={true}
          >
            &#10005;
          </Button>
 
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
