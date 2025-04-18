import { redirect } from "next/navigation";
import { XIcon } from "./icons/icons";
import { Button } from "./ui/button";

const XCardAuth = () => {
  return (
    <div>
      <XIcon width={100} height={100} />
      <p>Connect your X account</p>
      <Button
        onClick={() => {
          redirect(
            "https://x.com/i/oauth2/authorize?response_type=code&client_id=Y29tLnNlY3JldGZpLmNvbV9jbGllbnRfaWQmYW1wO2redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Ftwitter&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain"
          );
        }}
        className="z-20 cursor-pointer"
      >
        Connect
      </Button>
    </div>
  );
};

export default XCardAuth;
