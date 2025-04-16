"use client";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { FileText, Eye, Trash2 } from "lucide-react";
import useDelete from "@/hooks/useDelete";
import { Fragment, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import NotFound from "../not-found";

interface Document {
  id: string;
  userId: string;
  file: string | null;
  fileName: string | null;
  fileType?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(extension ?? "")) return "pdf";
  if (["doc", "docx"].includes(extension ?? "")) return "doc";
  if (["xls", "xlsx"].includes(extension ?? "")) return "excel";
  return "other";
};

const getViewerUrl = (fileUrl: string, fileName: string) => {
  const fileType = getFileType(fileName);

  if (fileType === "pdf") {
    return `${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`;
  }

  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};

const SecureDocumentViewer = ({
  file,
  fileName,
}: {
  file: string;
  fileName: string;
}) => {
  const viewerUrl = getViewerUrl(file, fileName);
  const fileType = getFileType(fileName);

  return (
    <div className="secure-viewer-container relative">
      <div
        className="watermark pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center opacity-10"
        style={{
          transform: "rotate(-45deg)",
          fontSize: "2rem",
          zIndex: 10,
        }}
      >
        CONFIDENTIAL
      </div>

      {fileType === "pdf" ? (
        <object
          data={viewerUrl}
          type="application/pdf"
          className="h-[60vh] w-full rounded border"
        >
          <embed
            src={viewerUrl}
            type="application/pdf"
            className="h-full w-full"
          />
        </object>
      ) : (
        <iframe
          src={viewerUrl}
          className="h-[60vh] w-full rounded border"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

const DocumentsContent = ({ id }: { id: string }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: financialDocs,
    isLoading: isFinancialDocsLoading,
    refetch: refetchFinancialDocs,
  } = api.overViewProfile.getFinancialDocs.useQuery({
    id,
  });
  const {
    data: corporateDocs,
    isLoading: isCorporateDocsLoading,
    refetch: refetchCorporateDocs,
  } = api.overViewProfile.getCorporateDecks.useQuery({
    id,
  });

  if (!id) return <NotFound />;

  return (
    <Fragment>
      <div className="flex h-[calc(100vh-6rem)] flex-col">
        <Card className="relative h-full rounded-t-[46px] bg-white">
          <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
            <h2 className="relative bottom-5 left-10 flex font-normal text-white">
              Company Documents
            </h2>
          </div>

          <div className="absolute top-14 h-[calc(100%-3.5rem)] w-full overflow-y-auto rounded-t-[45px] bg-white p-14 pt-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#E3EFFF] px-4 py-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">Corporate Deck</span>
                </div>

                <div className="rounded-lg bg-white">
                  <div className="mb-2 grid grid-cols-12 gap-2 rounded-full bg-[#F8F9FA] px-4 py-2 text-sm font-medium text-gray-500">
                    <div className="col-span-6 text-black">Item</div>
                    <div className="col-span-6 text-black">Uploaded</div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {corporateDocs?.length === 0 && (
                      <div className="mt-4 flex h-full items-center justify-center">
                        <p className="text-xs text-gray-500">
                          No corporate deck documents found
                        </p>
                      </div>
                    )}
                    {corporateDocs?.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-12 gap-2 border-b border-gray-100 p-3 hover:bg-gray-50"
                      >
                        <div className="col-span-6 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="truncate text-xs text-black">
                            {doc.fileName}
                          </span>
                        </div>

                        <div className="col-span-4 text-xs text-gray-500">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Jan 14, 2021"}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc as Document);
                              setIsDialogOpen(true);
                            }}
                            className="rounded p-1 hover:bg-gray-100"
                          >
                            <Eye className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial Documents Column */}
              <div>
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#E3EFFF] px-4 py-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-medium">Financials</span>
                </div>

                <div className="rounded-lg bg-white">
                  <div className="mb-2 grid grid-cols-12 gap-2 rounded-full bg-[#F8F9FA] px-4 py-2 text-sm font-medium text-gray-500">
                    <div className="col-span-5 text-black">Item</div>
                    <div className="col-span-4 text-black">Uploaded</div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {financialDocs?.length === 0 && (
                      <div className="mt-4 flex h-full items-center justify-center">
                        <p className="text-xs text-gray-500">
                          No financial documents found
                        </p>
                      </div>
                    )}
                    {financialDocs?.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-12 gap-2 border-b border-gray-100 p-3 hover:bg-gray-50"
                      >
                        <div className="col-span-6 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="truncate text-xs text-black">
                            {doc.fileName}
                          </span>
                        </div>

                        <div className="col-span-4 text-xs text-gray-500">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Jan 14, 2021"}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc as Document);
                              setIsDialogOpen(true);
                            }}
                            className="rounded p-1 hover:bg-gray-100"
                          >
                            <Eye className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Document Preview</DialogTitle>
                <DialogDescription>{selectedDoc?.fileName}</DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                {selectedDoc?.file ? (
                  <SecureDocumentViewer
                    file={selectedDoc.file}
                    fileName={selectedDoc.fileName ?? "document.pdf"}
                  />
                ) : (
                  <div className="flex h-[60vh] items-center justify-center">
                    No preview available
                  </div>
                )}
              </div>

              {process.env.NODE_ENV === "development" && selectedDoc && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>File URL: {selectedDoc.file}</p>
                  <p>File Name: {selectedDoc.fileName}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </Fragment>
  );
};

export default DocumentsContent;
