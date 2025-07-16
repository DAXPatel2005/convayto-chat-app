import { useUser } from "../authentication/useUser";
import { formatTime } from "../../utils/common";

function MessageItem({ message }) {
  const { user } = useUser();
  const isImage = message?.content?.match(/\.(jpeg|jpg|png|webp)$/i);

  return (
    <div
      className={`relative ${
        message?.sender_id === user.id
          ? "self-end rounded-br-none bg-gradient-to-br from-bgAccent to-bgAccentDim text-textPrimary-dark before:absolute before:bottom-0 before:right-0 before:h-0 before:w-0 before:translate-x-full before:border-l-8 before:border-t-8 before:border-l-bgAccentDim before:border-t-transparent before:content-[''] dark:from-bgAccent-dark dark:to-bgAccentDim-dark before:dark:border-l-bgAccentDim-dark"
          : "rounded-bl-none bg-bgPrimary before:absolute before:bottom-0 before:left-0 before:h-0 before:w-0 before:-translate-x-full before:border-r-8 before:border-t-8 before:border-r-bgPrimary before:border-t-transparent before:content-[''] dark:bg-LightShade/20 before:dark:border-r-LightShade/20"
      } my-1 w-fit max-w-[80%] rounded-2xl px-4 py-2 shadow-md before:shadow-md`}
    >
      {isImage ? (
        <img
          src={message.content}
          alt="sent image"
          className="max-w-xs rounded-lg"
        />
      ) : (
        <p>{message.content}</p>
      )}
      <span className="float-right ml-2 mt-2 select-none text-xs opacity-70 block">
        {formatTime(message?.created_at)}
      </span>
    </div>
  );
}

export default MessageItem;
