import React from "react";

export function Avatar({ player }) {
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      src={`https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png`}
      alt="Avatar"
    />
  );
}
