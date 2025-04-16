import React, { useEffect } from "react";
import { X, Mic, Paperclip, File, ArrowLeft } from "lucide-react";

// Define the Endorsement type
export interface Endorsement {
  id: string;
  userName: string;
  message: string;
  userPhoto: string;
  audioUrl?: string;
  files?: string[];
  createdAt: string;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  endorsement: Endorsement | null;
}

const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  endorsement,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";

      // Optional: Add padding to prevent layout shift
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    // Cleanup function to ensure scrolling is restored
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative mx-4 my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Close Button */}
        <span className="sticky top-0 z-10 flex w-full flex-row bg-[#40C3F3] p-4">
          <button
            onClick={onClose}
            className="flex flex-row gap-2 text-white hover:text-slate-200"
          >
            <ArrowLeft className="h-6 w-6" /> <p>Go Back</p>
          </button>
        </span>

        {/* User Info */}
        <div className="p-6">
          <div className="mb-4 flex items-start space-x-4">
            <img
              src={endorsement?.userPhoto ?? "/assets/images/profile.png"}
              alt={endorsement?.userName ?? ""}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="flex w-full flex-col gap-4">
              <h2 className="text-xl font-semibold">{endorsement?.userName}</h2>
              <p className="text-gray-700">{endorsement?.message}</p>

              {endorsement?.audioUrl && (
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center">
                    <Mic className="mr-2 h-5 w-5 text-[#40C3F3]" />
                    <span className="font-medium">Voice Message</span>
                  </div>
                  <audio
                    controls
                    src={endorsement?.audioUrl ?? ""}
                    className="w-full"
                  />
                </div>
              )}

              {endorsement?.files && endorsement?.files.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center font-medium">
                    <Paperclip className="mr-2 h-5 w-5 text-blue-500" />
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {endorsement?.files.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 hover:bg-gray-100"
                      >
                        <File className="h-5 w-5 text-blue-500" />
                        <span>Attachment {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
