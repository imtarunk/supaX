export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-black text-white antialiased relative">
        <div className="flex h-screen w-full items-center justify-center">
          {children}
          <div className="w-1/2 h-[100vh]">
            {/* <img
              src="/hand.png"
              alt="SuperFi"
              className="object-cover h-150 w-150 absolute right-100 top-50"
              priority
            /> */}
          </div>
        </div>
        {/* Page Content */}
      </body>
    </html>
  );
}
