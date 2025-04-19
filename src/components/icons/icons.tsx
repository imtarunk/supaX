import Image from "next/image";

export const XIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/x.png" alt="Twitter" width={width} height={height} />
    </>
  );
};

export const FollowIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/person.png" alt="Follow" width={width} height={height} />
    </>
  );
};

export const LikeIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/like.png" alt="Like" width={width} height={height} />
    </>
  );
};

export const DefaultIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/default.png" alt="Tweet" width={width} height={height} />
    </>
  );
};

export const LoginIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        id="sign-in"
        className="h-8 w-8 md:h-12 md:w-12 cursor-pointer hover:scale-110 transition-all duration-300 "
      >
        <path
          fill="#6563ff"
          d="M21 12c0-.34-.02-.67-.05-1H12.5V9.5a1 1 0 0 0-1.707-.707l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5A1 1 0 0 0 12.5 14.5V13h8.45c.03-.33.05-.66.05-1Z"
        ></path>
        <path
          fill="#b2b1ff"
          d="M12.5 13v1.5a1 1 0 0 1-1.707.707l-2.5-2.5a1 1 0 0 1 0-1.414l2.5-2.5A1 1 0 0 1 12.5 9.5V11h8.45a10 10 0 1 0 0 2Z"
        ></path>
      </svg>
    </>
  );
};
