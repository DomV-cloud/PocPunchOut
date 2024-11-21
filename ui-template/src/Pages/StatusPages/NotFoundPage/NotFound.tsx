
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-lg">Sorry, but this site is not found.</p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">Back to Home page</a>
    </div>
  );
};

export default NotFound;
