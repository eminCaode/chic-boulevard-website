import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";
import { signOutAction } from "../_lib/action";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button>
        <span className="flex gap-1 items-center cursor-pointer">
          <HiMiniArrowRightStartOnRectangle /> Sign Out
        </span>
      </button>
    </form>
  );
}

export default SignOutButton;
