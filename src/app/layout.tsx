import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import "@/styles/styles.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
