export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      {children}
      {/* <img
          src="/hand.png"
          alt="SuperFi"
          className="object-cover h-150 w-150 absolute right-100 top-50"
          priority
        /> */}
    </div>
  );
}
