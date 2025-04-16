import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Twitter,
  Keyboard,
  Mic,
  Link2,
  Play,
  Pause,
  ArrowLeft,
  File,
} from "lucide-react";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import useUpload from "@/hooks/useUpload";
import useUploadAudio from "@/hooks/useUploadAudio";
import { toast } from "@/components/ui/use-toast";

interface EndorseModalProps {
  show: boolean;
  onClose: () => void;
  companyName: string;
}

interface UploadedFile {
  name: string;
  url: string;
  file: File;
}

const EndorseModal = ({ show, onClose, companyName }: EndorseModalProps) => {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("id");

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showThankYou, setshowThankYou] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [inputText, setInputText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add state for uploaded files URLs
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Setup file upload hook
  const { handleUpload, uploading: fileUploading } = useUpload({
    files: uploadedFiles.map((file) => file.file),
    callback: (url) => {
      const fileUrl = `https://images.fundpitch.com/endorsements/${url}`;
      setUploadedFileUrls((prev) => [...prev, fileUrl]);

      // Submit endorsement after all files are uploaded
      if (uploadedFiles.length === uploadedFileUrls.length + 1) {
        submitEndorsement([...uploadedFileUrls, fileUrl]);
      }
    },
  });

  // Setup audio upload hook
  const { uploadInterview: uploadAudio, uploading: audioUploading } =
    useUploadAudio((url) => {
      const audioUrl = `${url}`;
      setAudioUrl(audioUrl);
    });

  const [isUploading, setIsUploading] = useState(false);

  const addEndorsement = api.individual.addEndorsement.useMutation({
    onSuccess: () => {
      toast({
        title: "Endorsement submitted successfully!",
      });
      cleanupResources();
      setshowThankYou(true);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit endorsement",
        description: error.message,
      });
      setIsUploading(false);
    },
  });

  // Modified submission function
  const submitEndorsement = (files?: string[]) => {
    if (!companyId) return;

    addEndorsement.mutate({
      companyId: companyId,
      message: inputText,
      audioUrl: audioUrl ?? undefined,
      files: files && files.length > 0 ? files : undefined,
    });
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setRecordedBlob(audioBlob);

        // Create audio element for playback
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Stop all tracks of the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Modified stopRecording to handle audio upload
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop and release microphone stream
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setRecordedBlob(audioBlob);

        // Create new audio element for playback
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Add ended event listener
        audio.addEventListener("ended", () => {
          setIsPlaying(false);
          setAudioWaves([]);
        });

        // Upload the audio file
        if (audioBlob) {
          uploadAudio(audioBlob);
        }

        // Clear MediaRecorder reference
        mediaRecorderRef.current = null;
      };
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  const handleRemoveAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    setRecordedAudio(null);
    setRecordedBlob(null);
    setAudioUrl(null);
    setAudioWaves([]);
  };

  const setupAudioVisualization = () => {
    if (!audioRef.current || !recordedAudio) return;

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: AudioContext })
            .webkitAudioContext)();
      }

      // Create analyzer if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;

        const audioSource = audioContextRef.current.createMediaElementSource(
          audioRef.current,
        );
        audioSource.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaves = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const waves = Array.from({ length: 20 }, (_, i) => {
          const index = Math.floor(i * (bufferLength / 20));
          return Math.min(100, (dataArray[index] ?? 0) / 2.55);
        });

        setAudioWaves(waves);

        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(updateWaves);
        }
      };

      updateWaves();
    } catch (error) {
      console.error("Audio visualization error:", error);
    }
  };

  const togglePlayAudio = async () => {
    if (!audioRef.current || !recordedAudio) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioWaves([]);
      } else {
        await audioRef.current.play();
        setupAudioVisualization();
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Audio playback error:", error);
      toast({
        title: "Failed to play audio",
      });
    }
  };

  const handleLinkClick = () => {
    setShowFileUpload(true);
    setShowKeyboard(false);
  };

  const handleBackToTextarea = () => {
    setShowFileUpload(false);
    setShowKeyboard(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (uploadedFiles.length + files.length > 3) {
      toast({
        title: "Maximum 3 files allowed",
      });
      return;
    }

    try {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File size too large");
        }
        // Check if file already exists
        if (
          uploadedFiles.some((existingFile) => existingFile.name === file.name)
        ) {
          throw new Error(`File ${file.name} already added`);
        }
        return {
          name: file.name,
          url: URL.createObjectURL(file),
          file: file,
        };
      });

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Failed to add files",
      });
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    if (newFiles[index]?.url) {
      URL.revokeObjectURL(newFiles[index].url);
    }
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);

    // Also remove from uploaded URLs if exists
    const newUrls = [...uploadedFileUrls];
    newUrls.splice(index, 1);
    setUploadedFileUrls(newUrls);
  };

  // Modified handleSubmit
  const handleSubmit = async () => {
    if (!companyId) {
      toast({
        title: "Company ID is missing",
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "Please enter your endorsement message",
      });
      return;
    }

    try {
      setIsUploading(true);

      // If there's recorded audio but not uploaded yet, wait
      if (recordedBlob && !audioUrl) {
        toast({
          title: "Please wait for audio to upload",
        });
        return;
      }

      // If there are files to upload, handle them first
      if (uploadedFiles.length > 0) {
        handleUpload({ folderName: "endorsements" });
      } else {
        // If no files, submit directly with audio if exists
        submitEndorsement();
      }
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Failed to upload",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Modified cleanup function to handle audio properly
  const cleanupResources = () => {
    // Cleanup URLs
    uploadedFiles.forEach((file) => {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }

    // Reset all states
    setUploadedFiles([]);
    setUploadedFileUrls([]);
    setRecordedAudio(null);
    setRecordedBlob(null);
    setAudioUrl(null);
    setInputText("");
    setAudioWaves([]);
    setShowFileUpload(false);
    setShowKeyboard(true);
    setIsPlaying(false);
    setShowReviewModal(false);
    setIsUploading(false);

    // Stop any ongoing audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // Add cleanup on modal close
  useEffect(() => {
    if (!show) {
      cleanupResources();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative flex w-2/4 rounded-xl bg-white shadow-lg">
        {showReviewModal ? (
          <div className="flex w-full flex-col rounded-lg">
            <button
              className="relative flex w-full flex-row items-center justify-start gap-2 rounded-t-lg bg-[#40C3F3] p-4 text-white"
              onClick={() => setShowReviewModal(false)}
            >
              <ArrowLeft size={16} />
              <p className="text-sm">Go Back</p>
            </button>

            <div className="flex flex-row gap-6 p-6 px-12">
              <span className="flex flex-shrink-0">
                <img
                  src="/assets/images/endorseuser.png"
                  alt=""
                  className="h-24 w-24"
                />
              </span>

              <span className="flex flex-col gap-2">
                <p className="text-lg font-bold">Indiviual user x</p>

                <p>{inputText}</p>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded border p-2"
                      >
                        <File />
                        <span className="flex-1 truncate text-sm">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {recordedAudio && (
                  <div className="mt-2 flex items-center rounded border p-3">
                    <button
                      onClick={togglePlayAudio}
                      className={`mr-3 rounded-full p-2 ${
                        isPlaying
                          ? "bg-[#40C3F3] text-white"
                          : "bg-blue-100 text-[#40C3F3]"
                      }`}
                      disabled={!recordedAudio}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <div className="flex-1">
                      <div className="mb-1 text-sm font-medium">audio.mp3</div>

                      <div className="flex h-4 items-center space-x-1">
                        {audioWaves.length > 0
                          ? audioWaves.map((height, i) => (
                              <div
                                key={i}
                                className="w-1 rounded-md bg-blue-500"
                                style={{ height: `${Math.max(4, height)}%` }}
                              ></div>
                            ))
                          : Array.from({ length: 20 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 rounded-full bg-gray-300"
                                style={{
                                  height: `${Math.max(4, Math.random() * 30)}%`,
                                }}
                              ></div>
                            ))}
                      </div>
                    </div>

                    <button
                      onClick={handleRemoveAudio}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </span>
            </div>
          </div>
        ) : (
          <>
            {showThankYou ? (
              <div className="flex w-full flex-col items-center justify-center gap-6 p-6">
                <img
                  src="/assets/images/thankyou.gif"
                  alt=""
                  className="h-40 w-40"
                />

                <p className="text-lg font-semibold">
                  Thank you for endorsing!
                </p>

                <p className="text-[#5E6670]">
                  {" "}
                  Your endorsement has been sent to{" "}
                  <span className="font-bold">{companyName}</span>
                </p>

                <button
                  className="text-sm font-normal text-[#5e6670c7] underline"
                  onClick={() => {
                    setshowThankYou(false);

                    onClose();
                  }}
                >
                  Return to home
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center rounded-l-xl bg-[#E3F3FF]">
                  <img
                    src="/assets/images/Modalbg.png"
                    alt="Email Illustration"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="m-10 flex w-3/4 flex-col justify-center">
                  <button
                    className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                  >
                    <X />
                  </button>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Embark on your Journey with a <br /> Company that you Trust
                  </h2>
                  <p className="mt-2 text-xs text-gray-600">
                    Got an endorsement to impact the growth of a company? Write,
                    speak or upload your thoughts here and take the first step
                    towards building something impactful.
                  </p>

                  <div className="inset-shadow-indigo-500/50 mt-4 flex h-2/6 flex-col rounded-lg border border-gray-100 p-4 shadow-lg">
                    {!showFileUpload ? (
                      <>
                        {showKeyboard && (
                          <textarea
                            placeholder="What do you have in mind?"
                            className="w-full bg-transparent text-slate-900 outline-none"
                            rows={2}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          ></textarea>
                        )}

                        <div className="mt-auto flex items-end justify-between">
                          <button
                            className={`rounded-full bg-blue-100 p-2 text-[#40C3F3] ${showKeyboard ? "bg-blue-200" : ""}`}
                            onClick={() => setShowKeyboard(true)}
                          >
                            <Keyboard size={20} />
                          </button>
                          <button
                            className={`rounded-full bg-blue-100 p-2 text-[#40C3F3] ${isRecording ? "animate-pulse bg-red-200" : ""}`}
                            onClick={handleMicClick}
                          >
                            <Mic size={20} />
                          </button>
                          <button
                            className="rounded-full bg-blue-100 p-2 text-[#40C3F3]"
                            onClick={handleLinkClick}
                          >
                            <Link2 size={20} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full flex-col">
                        {/* File Upload UI */}
                        <div
                          className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-[#18181B0A] p-4"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <img
                            src="/assets/images/fileicon.png"
                            alt="File icon"
                            className="mb-2 h-8 w-8"
                          />
                          <p className="mb-1 text-sm text-gray-600">
                            Drag and drop your file or{" "}
                            <span
                              className="cursor-pointer text-blue-500"
                              onClick={handleChooseFile}
                            >
                              choose file
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileInputChange}
                            multiple
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {recordedAudio && (
                    <div className="mt-2 flex items-center rounded border p-3">
                      <button
                        onClick={togglePlayAudio}
                        className={`mr-3 rounded-full p-2 ${
                          isPlaying
                            ? "bg-[#40C3F3] text-white"
                            : "bg-blue-100 text-[#40C3F3]"
                        }`}
                        disabled={!recordedAudio}
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>

                      <div className="flex-1">
                        <div className="mb-1 text-sm font-medium">
                          audio.mp3
                        </div>

                        <div className="flex h-4 items-center space-x-1">
                          {audioWaves.length > 0
                            ? audioWaves.map((height, i) => (
                                <div
                                  key={i}
                                  className="w-1 rounded-md bg-blue-500"
                                  style={{ height: `${Math.max(4, height)}%` }}
                                ></div>
                              ))
                            : Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 rounded-full bg-gray-300"
                                  style={{
                                    height: `${Math.max(4, Math.random() * 30)}%`,
                                  }}
                                ></div>
                              ))}
                        </div>
                      </div>

                      <button
                        onClick={handleRemoveAudio}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded border p-2"
                        >
                          <File />
                          <span className="flex-1 truncate text-sm">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-14 flex justify-center space-x-4">
                    {showFileUpload && (
                      <button
                        className="mt-4 flex w-1/2 items-center justify-center rounded-xl border border-[#615bff39] border-gray-300 bg-[#d9d9d92c] py-2 text-gray-400 hover:border-none hover:bg-[#40C3F3] hover:text-white"
                        onClick={handleBackToTextarea}
                      >
                        Back
                      </button>
                    )}

                    {!showFileUpload && (
                      <button
                        className="mt-4 flex w-1/2 items-center justify-center rounded-xl border border-[#615bff39] border-gray-300 bg-[#d9d9d92c] py-2 text-gray-400 hover:border-none hover:bg-[#40C3F3] hover:text-white"
                        onClick={() => setShowReviewModal(true)}
                      >
                        Preview
                      </button>
                    )}
                    <button
                      className="mt-4 w-1/2 rounded-full bg-[#40C3F3] py-2 text-white disabled:bg-gray-300"
                      onClick={handleSubmit}
                      disabled={Boolean(
                        isUploading ||
                          addEndorsement.isPending ||
                          fileUploading ||
                          audioUploading ||
                          !inputText.trim() ||
                          !companyId ||
                          (recordedBlob && !audioUrl), // Disable if audio is still uploading
                      )}
                    >
                      {isUploading ||
                      addEndorsement.isPending ||
                      fileUploading ||
                      audioUploading
                        ? "Submitting..."
                        : "Submit"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EndorseModal;
