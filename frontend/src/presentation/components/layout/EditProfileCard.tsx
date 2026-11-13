import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EditProfileProps {
      currentName: string;
      currentImage: string;
      onClose: () => void;
      onSave?: (data: { name?: string; image?: string }) => void;
}

const EditProfileCard: React.FC<EditProfileProps> = ({
      currentName,
      currentImage,
      onClose,
      onSave,
}) => {
      const [name, setName] = useState(currentName);
      const [image, setImage] = useState(currentImage);
      const selectRef = useRef<HTMLDivElement>(null);

      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            setImage(url);
      };


      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                         onClose();
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, [onClose]);


      return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={selectRef} className="bg-white p-6 w-80 rounded-xl shadow-xl relative">
                  <h2 className="text-lg font-semibold mb-4">Modifier votre profil</h2>

                  {/* Close icon */}
                  <button onClick={onClose} className=" absolute -right-4 -top-5 cursor-pointer border-0">
                        <X className="w-7 h-7 hover:font-bold text-dark transition duration-200" />
                  </button>

                  {/* Photo */}
                  <div className="flex flex-col items-center mb-4">
                        <div className="relative">
                              <img
                                    src={image}
                                    className="w-24 h-24 rounded-full object-cover border"
                              />
                              <label className="absolute bottom-0 right-0 bg-dark p-1 rounded-full cursor-pointer">
                                    <Camera className="w-4 h-4 text-white" />
                                    <input type="file" className="hidden" onChange={handleImageUpload} />
                              </label>
                        </div>
                  </div>

                  {/* Name input */}
                  <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm mb-4"
                  />

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                        <button
                              className="px-3 py-2 text-sm text-gray-500 cursor-pointer"
                              onClick={onClose}
                        >
                              Annuler
                        </button>

                        <button
                              className="px-3 py-2 bg-dark cursor-pointer text-white text-sm rounded-md"
                              onClick={() => {
                                    onSave?.({ name, image });
                                    onClose();
                              }}
                        >
                              Sauvegarder
                        </button>
                  </div>
            </div>
      </div>
      );
};

export default EditProfileCard;
