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
