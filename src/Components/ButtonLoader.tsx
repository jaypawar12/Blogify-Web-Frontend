export const ButtonLoader = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center">
        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        <span className="ml-2">{message}</span>
    </div>
);