
interface AuthMessagesProps {
  error: string | null;
  message: string | null;
}

export const AuthMessages = ({ error, message }: AuthMessagesProps) => {
  if (!error && !message) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{message}</p>
        </div>
      )}
    </div>
  );
};
