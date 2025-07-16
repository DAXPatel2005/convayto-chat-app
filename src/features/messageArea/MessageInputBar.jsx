import { RiSendPlaneFill } from "react-icons/ri";
import { FiPaperclip } from "react-icons/fi";
import { useUser } from "../authentication/useUser";
import { useRef, useState } from "react";
import { useSendNewMessage } from "./useSendNewMessage";
import { v4 as uuid } from "uuid";
import Loader from "../../components/Loader";
import useConvInfo from "./useConvInfo";
import supabase from "../../services/supabase";
import { toast } from "react-hot-toast";

function MessageInputBar() {
  const {
    convInfo,
    isPending: isPendingConvInfo,
    isError: isConvInfoError,
  } = useConvInfo();

  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isSending, sendNewMessage } = useSendNewMessage();
  const { user } = useUser();

  const conversationId = convInfo?.id;
  const friendUserId = convInfo?.friendInfo?.id;
  const myUserId = user?.id;

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !conversationId) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${conversationId}/${uuid()}.${fileExt}`;

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("message-attachments")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Failed to upload file");
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("message-attachments")
      .getPublicUrl(filePath);

    const messageObj = {
      id: uuid(),
      conversation_id: conversationId,
      content: publicUrl,
      friendUserId,
      sender_id: myUserId,
      created_at: new Date(),
      optimistic: true,
    };

    sendNewMessage(messageObj);
    setUploading(false);
  }

  function handleSendNewMessage(e) {
    e.preventDefault();
    inputRef.current.focus();

    if (!newMessage) return;

    const messageObj = {
      id: uuid(),
      conversation_id: conversationId,
      content: newMessage,
      friendUserId,
      sender_id: myUserId,
      created_at: new Date(),
      optimistic: true,
    };

    setNewMessage("");

    sendNewMessage(messageObj, {
      onError: (_, message) => {
        setNewMessage(message.content);
      },
    });
  }

  if (isConvInfoError) return null;

  return (
    <div className="px-4 py-2">
      <form
        onSubmit={handleSendNewMessage}
        className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-transparent bg-bgPrimary px-3 py-2 shadow-lg dark:border-LightShade/20 dark:bg-LightShade/20"
      >
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading || isPendingConvInfo}
          className="text-xl text-textSecondary hover:text-textPrimary"
          title="Attach file"
        >
          <FiPaperclip />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Text Input */}
        <input
          ref={inputRef}
          disabled={isPendingConvInfo || uploading}
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder={uploading ? "Uploading file..." : "Type a message"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSending || uploading || isPendingConvInfo}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-bgAccent text-xl text-textPrimary-dark hover:bg-bgAccentDim active:scale-95 disabled:opacity-70 dark:bg-bgAccent-dark dark:hover:bg-bgAccentDim-dark"
        >
          {isSending ? <Loader size="small" /> : <RiSendPlaneFill />}
        </button>
      </form>
    </div>
  );
}

export default MessageInputBar;
