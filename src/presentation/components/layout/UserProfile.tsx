import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import EditProfileCard from "./EditProfileCard";
import { useAuth } from "../../../application/context/AuthContext";

interface UserProfileProps {
  name: string;
  level: string;
  image: string;
  onUpdateProfile?: (data: { name?: string; image?: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, level, image, onUpdateProfile }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [showEdit, setShowEdit] = useState(false);
      const selectRef = useRef<HTMLDivElement>(null);

      const { logout } = useAuth();

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                        setIsOpen(false);
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, []);

      return (
            <div ref={selectRef} className="relative">
                  {/* Name */}
                  <div
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => setIsOpen(!isOpen)}
                  >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                              <img src={image} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        {/* Name + Level */}
                        <div className="hidden md:block text-left">
                              <div className="flex items-center gap-1">
                                    <p className="text-sm font-semibold text-dark">{name}</p>
                                    <ChevronDown className="w-4 h-4 text-dark" />
                              </div>
                              <p className="text-xs text-gray-500">{level}</p>
                        </div>
                  </div>

                  {/* Dropdown menu */}
                  {isOpen && (
                        <div className="absolute right-0 mt-3 bg-white shadow-lg border-gray-50 rounded-md w-48 p-2 z-20">
                              <button
                                    onClick={() => {
                                          setShowEdit(true);
                                          setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm cursor-pointer"
                              >
                                    Modifier le profil
                              </button>
                              <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 text-sm text-red-500">
                                    Déconnexion
                              </button>
                        </div>
                  )}

                  {/* Popup d'édition */}
                  {showEdit && (
                        <EditProfileCard
                              currentName={name}
                              currentImage={image}
                              onClose={() => setShowEdit(false)}
                              onSave={onUpdateProfile}
                        />
                  )}
            </div>
      );
};

export default UserProfile;
