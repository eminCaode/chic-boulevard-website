import { auth } from "../_lib/auth";

export const metadata = {
  title: "Account",
};
async function page() {
  const session = await auth();
  return <div>hello</div>;
}

export default page;
