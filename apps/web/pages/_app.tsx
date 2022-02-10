import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-slate-700 overflow-auto min-h-screen">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
